import UserService from "../../services/UserService";

export const revalidate = 60;

const ServerPage = async () => {
  const userService = new UserService();

  const users = await userService.getAll();
  const user = await userService.getById(users.at(0)?.id!);

  return (
    <main>
      <h4>ServerPage</h4>

      <ul>
        {users.map((user) => (
          <li
            key={user.id}
          >{`${user.id} - ${user.firstName} ${user.lastName}`}</li>
        ))}
      </ul>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
};

export default ServerPage;
