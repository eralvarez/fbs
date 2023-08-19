"use client";
import { useRef, useState, useEffect } from "react";
import { faker } from "@faker-js/faker";

import UserService from "../../services/UserService";

const CrudExamplePage = () => {
  const { current: userService } = useRef(new UserService());
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>();
  const [listenerUser, setListenerUser] = useState<any>();

  useEffect(() => {
    if (selectedUser) {
      const unsubscribe = userService.onChange(selectedUser.id, (_user) => {
        console.log(JSON.stringify(_user, null, 2));
        setListenerUser(_user);
      });

      return () => unsubscribe();
    }
  }, [selectedUser]);

  const loadAllUsers = async () => {
    const _users = await userService.getAll();
    console.log(_users);
    setUsers(_users);
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

  return (
    <main>
      <button onClick={loadAllUsers}>Load users</button>
      <hr />
      <button onClick={handleCreateUser}>Create user</button>
      <hr />
      <h4>Update user</h4>
      <p>Select a user form list and click update user</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span>{`${user.firstName} ${user.lastName}`}</span>
            <button onClick={() => handleSelectUser(user)}>Select</button>
            <button onClick={() => handleDeleteUser(user, true)}>
              soft Delete
            </button>
            <button onClick={() => handleDeleteUser(user, false)}>
              hard Delete
            </button>
          </li>
        ))}
      </ul>
      {selectedUser && <pre>{JSON.stringify(selectedUser, null, 2)}</pre>}
      <button onClick={handleUpdateUser}>update user</button>

      <hr />
      {listenerUser && (
        <>
          <h4>listener user</h4>
          {listenerUser && <pre>{JSON.stringify(listenerUser, null, 2)}</pre>}
        </>
      )}
    </main>
  );
};

export default CrudExamplePage;
