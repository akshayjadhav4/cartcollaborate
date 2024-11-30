import database from "@/DB";
import Group from "@/DB/model/Group";
import { useAuth } from "../useAuth";
import { useEffect, useState } from "react";
import { TableName } from "@/DB/schema";
import GroupMember, { GroupRole } from "@/DB/model/GroupMember";
import { Q } from "@nozbe/watermelondb";
import { supabase } from "@/supabase";
import { Errors } from "@/constants/Errors";
import useSync from "./useSync";

const useGroup = ({
  groupID,
  fetchGroupCollections,
}: {
  groupID?: string;
  fetchGroupCollections?: boolean;
}) => {
  const { user } = useAuth();
  const { trigger } = useSync();
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (fetchGroupCollections) {
      const subscription = database.collections
        .get<GroupMember>(TableName.GroupMembers)
        .query(Q.where("user_id", user?.id ?? null))
        .observe()
        .subscribe(async (results) => {
          const userGroupIds = results.map((result) => result.group_id);
          const userGroups = await database.collections
            .get<Group>(TableName.Groups)
            .query(Q.where("id", Q.oneOf(userGroupIds)))
            .fetch();
          setGroups(userGroups);
        });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  const createGroup = user
    ? async ({ name, description }: { name: string; description: string }) => {
        await database.write(async () => {
          const createdGroup = await database
            .get<Group>(TableName.Groups)
            .create((group) => {
              group.name = name;
              group.description = description;
              group.owner_id = user?.id;
            });
          if (createdGroup.id) {
            await database
              .get<GroupMember>(TableName.GroupMembers)
              .create((member) => {
                member.role = GroupRole.Owner;
                member.group_id = createdGroup.id;
                member.user_id = user.id;
              });
          }
        });
      }
    : null;

  const joinGroup = user
    ? async ({ code }: { code: string }) => {
        let { data } = await supabase.from("groups").select("*").eq("id", code);

        if (data?.length === 0 || data?.[0]?.id !== code) {
          throw new Error(Errors.GROUP_WITH_ID_NOT_FOUND);
        }

        const { error } = await supabase
          .from("group_members")
          .insert([
            { role: GroupRole.Member, user_id: user?.id, group_id: code },
          ]);
        if (error) {
          throw new Error(Errors.NOT_ABLE_TO_JOIN_GROUP);
        }
      }
    : null;

  useEffect(() => {
    if (groupID) {
      const subscription = database.collections
        .get<Group>(TableName.Groups)
        .query(Q.where("id", groupID))
        .observe()
        .subscribe(async (results) => {
          setGroup(results?.[0] || null);
        });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [groupID]);

  const getMembers = async (groupId: string) => {
    if (groupId) {
      let { data: groupMembers, error } = await supabase
        .from(TableName.GroupMembers)
        .select(
          `id, role, created_at, user_id, profile:profiles(display_name, email)`
        )
        .eq("group_id", groupId)
        .is("deleted_at", null); // Only fetch active members
      if (error) {
        throw new Error(Errors.FAILED_TO_LOAD_GROUP_MEMBERS);
      }
      return groupMembers;
    }
    return null;
  };

  return { createGroup, groups, joinGroup, group, getMembers };
};

export default useGroup;
