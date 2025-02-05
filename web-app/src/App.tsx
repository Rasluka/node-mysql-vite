import { useState, useEffect } from "react";
// import { useEffect } from "react";
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  UserIcon,
  UserGroupIcon,
  PhotoIcon,
  AtSymbolIcon,
} from "@heroicons/react/16/solid";
// import {} from "@heroicons/react/16/solid";

interface IUser {
  id: number;
  name: string;
  email: string;
  age: number;
}

function App() {
  // document.title = "User Dashboard!";
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:7000/users");

        if (!response.ok) {
          throw new Error("Could not fetch from users api!");
        }

        const { data } = await response.json();
        console.log("Fetch data:", data);
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-3/6">
        <div className="flex items-center justify-center">
          {!isFormVisible ? (
            <UserPlusIcon
              className="size-12 text-green-600 hover:text-green-500 active:text-green-400 text-center hover:scale-110 transition-transform duration-300"
              title="Add new user"
              onClick={() => setIsFormVisible(!isFormVisible)}
            />
          ) : (
            <XMarkIcon
              className="size-12 text-red-600 hover:text-red-500 active:text-red-400 text-center hover:scale-110 transition-transform duration-300"
              title="Add new user"
              onClick={() => setIsFormVisible(!isFormVisible)}
            />
          )}
        </div>

        {/* TABLE */}
        <div
          className={`overflow-x-auto rounded-box border border-base-content/5 bg-base-100 transition-all duration-300 ${
            !isFormVisible
              ? "opacity-100 scale-100"
              : "opacity-0 hidden scale-0"
          }`}
        >
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((singleUser: IUser) => {
                return (
                  <tr key={singleUser.id}>
                    <th>{singleUser.id}</th>
                    <td>{singleUser.name}</td>
                    <td>{singleUser.email}</td>
                    <td>{singleUser.age}</td>
                    <td>
                      <div className="inline-flex gap-2">
                        <PencilIcon
                          className="size-6 text-blue-500 hover:text-blue-600 active:text-blue-700 hover:scale-110 transition-transform duration-300"
                          title="Edit"
                        />

                        <TrashIcon
                          className="size-6 text-red-500 hover:text-red-600 active:text-red-700 hover:scale-110 transition-transform duration-300"
                          title="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FORM */}
        <div
          className={`rounded-box p-3 border border-base-content/5 bg-base-100 transition- duration-300 ${
            isFormVisible ? "opacity-100 scale-100" : "opacity-0 hidden scale-0"
          }`}
        >
          <label className="input">
            {/* <span className="badge badge-neutral badge-xs">Optional</span> */}
            <UserIcon className="size-6" />
            <input type="text" className="grow" placeholder="Firstname" />
          </label>

          <label className="input">
            <UserGroupIcon className="size-6" />
            <input type="text" className="grow" placeholder="Lastname" />
          </label>

          <label className="input">
            <PhotoIcon className="size-6" />
            <input type="text" className="grow" placeholder="Avatar URL" />
          </label>

          <label className="input">
            <AtSymbolIcon className="size-6" />
            <input type="text" className="grow" placeholder="Email" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
