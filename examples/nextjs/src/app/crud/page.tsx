"use client";
import { useRef, useState, useEffect } from "react";
import { faker } from "@faker-js/faker";

import UserService from "../../services/UserService";
import { PaginationOptions } from "../../../../../lib/esm/";

const CrudExamplePage = () => {
  const { current: userService } = useRef(new UserService());
  const [users, setUsers] = useState<any[]>([]);
  const [paginatedUsers, setPaginatedUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>();
  const [listenerUser, setListenerUser] = useState<any>();
  const [listenerUser2, setListenerUser2] = useState<any>();

  useEffect(() => {
    if (selectedUser) {
      // Elaina
      // selectedUser.id
      const unsubscribe = userService.onChange(
        ["firstName", "==", "Elaina"],
        (_user) => {
          console.log(JSON.stringify(_user, null, 2));
          setListenerUser(_user);
        }
      );

      return () => unsubscribe();
    }
  }, [selectedUser]);

  useEffect(() => {
    // Elaina
    // selectedUser.id
    const unsubscribe = userService.onChange(
      ["firstName", "==", "Erickk"],
      (_user) => {
        console.log(JSON.stringify(_user, null, 2));
        setListenerUser2(_user);
      }
    );

    return () => unsubscribe();
  }, []);

  const loadAllUsers = async () => {
    const _users = await userService.getAll();
    console.log(_users);
    setUsers(_users);
  };

  const loadPaginatedUsers = async (pagination?: PaginationOptions) => {
    const _users = await userService.getAll({ limitBy: 2, pagination });
    setPaginatedUsers(_users);
  };

  const handleCreateUser = async () => {
    try {
      const user = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int({ min: 10, max: 100 }),
      };
      console.log(user);
      const createdUser = await userService.create(user);
      console.log(createdUser);
    } catch (error) {
      console.log("error handleCreateUser:");
      console.error(error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) {
        return null;
      }

      const userToUpdate = {
        ...selectedUser,
        lastName: faker.person.lastName(),
        age: faker.number.int({ min: 10, max: 100 }),
      };

      await userService.update(selectedUser.id, userToUpdate);
    } catch (error) {}
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = async (user: any, isSoftDelete: boolean = true) => {
    try {
      await userService.delete(user.id, isSoftDelete);
    } catch (error) {}
  };

  // const handleNextPagination =

  return (
    <main>
      <button onClick={loadAllUsers}>Load users</button>
      <button onClick={() => loadPaginatedUsers()}>Load paginated users</button>
      <hr />
      <button onClick={handleCreateUser}>Create user</button>
      <hr />
      <h4>Update user</h4>
      <p>Select a user form list and click update user</p>
      <ol>
        {users.map((user) => (
          <li key={user.id}>
            <span>{`${user.firstName} ${user.lastName} - ${user.createdAt}`}</span>
            <button onClick={() => handleSelectUser(user)}>Select</button>
            <button onClick={() => handleDeleteUser(user, true)}>
              soft Delete
            </button>
            <button onClick={() => handleDeleteUser(user, false)}>
              hard Delete
            </button>
          </li>
        ))}
      </ol>
      {selectedUser && <pre>{JSON.stringify(selectedUser, null, 2)}</pre>}
      <button onClick={handleUpdateUser}>update user</button>

      <hr />
      {listenerUser && (
        <>
          <h4>listener user</h4>
          {listenerUser && <pre>{JSON.stringify(listenerUser, null, 2)}</pre>}
        </>
      )}

      <hr />
      <h4>pagination 2 by 2</h4>
      <ol>
        {paginatedUsers.map((user) => (
          <li key={user.id}>
            <span>{`${user.firstName} ${user.lastName} - ${user.createdAt}`}</span>
          </li>
        ))}
      </ol>
      <button onClick={() => loadPaginatedUsers(PaginationOptions.PREVIOUS)}>
        prev
      </button>
      <button onClick={() => loadPaginatedUsers(PaginationOptions.NEXT)}>
        next
      </button>

      <hr />
      {listenerUser2 && (
        <>
          <h4>listener user 2</h4>
          {listenerUser2 && <pre>{JSON.stringify(listenerUser2, null, 2)}</pre>}
        </>
      )}
    </main>
  );
};

export default CrudExamplePage;
