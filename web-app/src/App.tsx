import { useState, useEffect } from "react";
// import { useEffect } from "react";
import { PencilIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/16/solid";
// import {} from "@heroicons/react/16/solid";

interface IUser {
  id: number;
  name: string;
  email: string;
  age: number;
}

function App() {
  document.title = "User Dashboard!";
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

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
      <div className="mx-auto w-3/6">
        <div className="flex items-center justify-center mb-4">
          <UserPlusIcon
            className="size-12 text-green-600 hover:text-green-500 text-center hover:scale-110 transition-transform duration-300"
            title="Add new user"
            onClick={() => setIsFormVisible(!isFormVisible)}
          />
        </div>

        {/* TABLE */}
        <div
          className={`overflow-x-auto rounded-box border border-base-content/5 bg-base-100 transition-transform duration-300 ${
            isFormVisible ? "scale-100" : "scale-0"
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
                          className="size-6 text-blue-500 hover:text-blue-600 hover:scale-110 transition-transform duration-300"
                          title="Edit"
                        />

                        <TrashIcon
                          className="size-6 text-red-500 hover:text-red-600 hover:scale-110 transition-transform duration-300"
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
          className={`rounded-box border border-base-content/5 bg-base-100 transition-transform duration-300 ${
            !isFormVisible ? "scale-100" : "scale-0"
          }`}
        >
          <fieldset className="fieldset">
            <legend className="fieldset-legend">What is your name?</legend>
            <input type="text" className="input" placeholder="Type here" />
            <p className="fieldset-label">Optional</p>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">What is your name?</legend>
            <input type="text" className="input" placeholder="Type here" />
            <p className="fieldset-label">Optional</p>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">What is your name?</legend>
            <input type="text" className="input" placeholder="Type here" />
            <p className="fieldset-label">Optional</p>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default App;
