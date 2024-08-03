import database from "@/DB";
import Group from "@/DB/model/Group";
import { useAuth } from "../useAuth";
import { useEffect, useState } from "react";
import { TableName } from "@/DB/schema";
import GroupMember, { GroupRole } from "@/DB/model/GroupMember";
import { Q } from "@nozbe/watermelondb";

const useGroup = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[] | null>(null);

  useEffect(() => {
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
        await database.write(async () => {
          await database
            .get<GroupMember>(TableName.GroupMembers)
            .create((member) => {
              member.role = GroupRole.Member;
              member.group_id = code;
              member.user_id = user.id;
            });
        });
      }
    : null;
  return { createGroup, groups, joinGroup };
};

export default useGroup;
