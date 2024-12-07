CREATE OR REPLACE function pushSync(changes jsonb) returns void as $$

DECLARE 
    new_created_groups jsonb;
    updated_group jsonb;
    new_joined_group_members jsonb;
    new_shopping_lists jsonb;
    updated_shopping_lists jsonb;
    new_shopping_list_item jsonb;
    updated_shopping_list_items jsonb;

BEGIN
    --------------------------
    ----------groups----------
    --------------------------

    --- insert created into groups
    FOR new_created_groups IN SELECT * FROM jsonb_array_elements(changes->'groups'->'created') LOOP
        INSERT INTO groups (id, owner_id, created_at, updated_at, name, description) VALUES (
            (new_created_groups->>'id')::uuid, 
            (new_created_groups->>'owner_id')::uuid, 
            epoch_to_timestamp(new_created_groups->>'created_at'), 
            epoch_to_timestamp(new_created_groups->>'updated_at'), 
            new_created_groups->>'name', 
            new_created_groups->>'description');
    END LOOP;

    --- update groups table
    FOR updated_group IN SELECT * FROM jsonb_array_elements(changes->'groups'->'updated') LOOP
        UPDATE groups SET 
            updated_at = epoch_to_timestamp(updated_group->>'updated_at'),
            name = updated_group->>'name',
            description = updated_group->>'description'
        WHERE id = (updated_group->>'id')::uuid;
    END LOOP;

    --- update groups deleted_at field based on deleted array
    WITH changes_data AS (
        SELECT (jsonb_array_elements_text(changes->'groups'->'deleted'))::uuid AS deleted
    )
    UPDATE groups
    SET deleted_at = now(),
        updated_at = now()
    FROM changes_data
    WHERE groups.id = changes_data.deleted;

    ---------------------------------
    ----------group_members----------
    ---------------------------------

    --- insert created into group_members
    FOR new_joined_group_members IN SELECT * FROM jsonb_array_elements(changes->'group_members'->'created') LOOP
        INSERT INTO group_members (id, created_at, updated_at, group_id, user_id, role) VALUES (
            (new_joined_group_members->>'id')::uuid, 
            epoch_to_timestamp(new_joined_group_members->>'created_at'), 
            epoch_to_timestamp(new_joined_group_members->>'updated_at'), 
            (new_joined_group_members->>'group_id')::uuid, 
            (new_joined_group_members->>'user_id')::uuid, 
            new_joined_group_members->>'role');
    END LOOP;

    --- update group_members deleted_at field based on deleted array
    WITH group_members_changes_data AS (
        SELECT (jsonb_array_elements_text(changes->'group_members'->'deleted'))::uuid AS deleted
    )
    UPDATE group_members
    SET deleted_at = now(),
        updated_at = now()
    FROM group_members_changes_data
    WHERE group_members.id = group_members_changes_data.deleted;

    ---------------------------------
    ----------shopping_list----------
    ---------------------------------

    --- insert created into shopping_lists
    FOR new_shopping_lists IN SELECT * FROM jsonb_array_elements(changes->'shopping_list'->'created') LOOP
        INSERT INTO shopping_list (id, created_at, updated_at, name, description, group_id, user_id, due_date_at) VALUES (
            (new_shopping_lists->>'id')::uuid, 
            epoch_to_timestamp(new_shopping_lists->>'created_at'), 
            epoch_to_timestamp(new_shopping_lists->>'updated_at'), 
            new_shopping_lists->>'name', 
            new_shopping_lists->>'description',
            (new_shopping_lists->>'group_id')::uuid,
            (new_shopping_lists->>'user_id')::uuid,
            epoch_to_timestamp(new_shopping_lists->>'due_date_at'));
    END LOOP;

    --- update shopping_lists table
    FOR updated_shopping_lists IN SELECT * FROM jsonb_array_elements(changes->'shopping_list'->'updated') LOOP
        UPDATE shopping_list SET 
            updated_at = epoch_to_timestamp(updated_shopping_lists->>'updated_at'),
            due_date_at = epoch_to_timestamp(updated_shopping_lists->>'due_date_at'),
            name = updated_shopping_lists->>'name',
            description = updated_shopping_lists->>'description'
        WHERE id = (updated_shopping_lists->>'id')::uuid;
    END LOOP;

    --- update shopping_lists deleted_at field based on deleted array
    WITH changes_shopping_lists_data AS (
        SELECT (jsonb_array_elements_text(changes->'shopping_list'->'deleted'))::uuid AS deleted
    )
    UPDATE shopping_list
    SET deleted_at = now(),
        updated_at = now()
    FROM changes_shopping_lists_data
    WHERE shopping_list.id = changes_shopping_lists_data.deleted;

    ---------------------------------
    --------shopping_list_item-------
    ---------------------------------

    --- insert created into shopping_list_item
    FOR new_shopping_list_item IN SELECT * FROM jsonb_array_elements(changes->'shopping_list_item'->'created') LOOP
        INSERT INTO shopping_list_item (id, created_at, updated_at, shopping_list_id, user_id, name, category, note, priority, quantity, is_purchased, unit) VALUES (
            (new_shopping_list_item->>'id')::uuid, 
            epoch_to_timestamp(new_shopping_list_item->>'created_at'), 
            epoch_to_timestamp(new_shopping_list_item->>'updated_at'), 
            (new_shopping_list_item->>'shopping_list_id')::uuid, 
            (new_shopping_list_item->>'user_id')::uuid, 
            new_shopping_list_item->>'name', 
            new_shopping_list_item->>'category', 
            new_shopping_list_item->>'note', 
            (new_shopping_list_item->>'priority')::numeric, 
            (new_shopping_list_item->>'quantity')::numeric, 
            (new_shopping_list_item->>'is_purchased')::boolean, 
            new_shopping_list_item->>'unit');
    END LOOP;

    --- update shopping_list_item table
    FOR updated_shopping_list_items IN SELECT * FROM jsonb_array_elements(changes->'shopping_list_item'->'updated') LOOP
        UPDATE shopping_list_item SET 
            updated_at = epoch_to_timestamp(updated_shopping_list_items->>'updated_at'),
            name = updated_shopping_list_items->>'name',
            note = updated_shopping_list_items->>'note',
            priority = (updated_shopping_list_items->>'priority')::numeric,
            quantity = (updated_shopping_list_items->>'quantity')::numeric,
            is_purchased = (updated_shopping_list_items->>'is_purchased')::boolean,
            unit = updated_shopping_list_items->>'unit',
            category = updated_shopping_list_items->>'category'
        WHERE id = (updated_shopping_list_items->>'id')::uuid;
    END LOOP;

    --- update shopping_list_item deleted_at field based on deleted array
    WITH changes_shopping_list_items_data AS (
        SELECT (jsonb_array_elements_text(changes->'shopping_list_item'->'deleted'))::uuid AS deleted
    )
    UPDATE shopping_list_item
    SET deleted_at = now(),
        updated_at = now()
    FROM changes_shopping_list_items_data
    WHERE shopping_list_item.id = changes_shopping_list_items_data.deleted;

END

$$ LANGUAGE plpgsql;