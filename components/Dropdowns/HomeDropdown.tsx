import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { MoreVertical } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const HomeDropdown = () => {
  const { push } = useRouter();
  const { signOut } = useAuth();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <MoreVertical />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        loop
        side="bottom"
        align="start"
        alignOffset={0}
        avoidCollisions
        collisionPadding={10}
        sideOffset={5}
      >
        <DropdownMenu.Group>
          <DropdownMenu.Label>Manage Groups</DropdownMenu.Label>
          <DropdownMenu.Item
            key="create"
            onSelect={() => {
              push("/(manage-group)/create");
            }}
          >
            <DropdownMenu.ItemTitle>Create Group</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="join">
            <DropdownMenu.ItemTitle>Join Group</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Item
          key="logout"
          onSelect={() => {
            signOut();
          }}
        >
          <DropdownMenu.ItemTitle>Log out</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default HomeDropdown;
