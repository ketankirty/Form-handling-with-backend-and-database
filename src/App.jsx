import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

const App = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  // ✅ Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (result.success) {
        setMessage("Form submitted successfully ✅");
        reset();
        fetchUsers(); // Refresh user list
      } else {
        setMessage("Submission failed ❌");
      }

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Something went wrong ❌");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-center font-semibold">Form</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        {/* Name Field */}
        <label className="m-4">Name</label> <br />
        <input
          type="text"
          className="bg-amber-200 border-2 p-2 m-4"
          placeholder="Enter your name"
          {...register("name", {
            required: { value: true, message: "This is mandatory" },
            minLength: { value: 3, message: "At least 3 characters" },
          })}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
        <br />

        {/* Password Field */}
        <label className="m-3">Password</label> <br />
        <input
          type="password"
          className="bg-amber-300 p-2 m-3 border-2"
          placeholder="Enter your password"
          {...register("password", {
            required: { value: true, message: "Mandatory" },
            minLength: {
              value: 3,
              message: "At least 3 characters",
            },
            maxLength: { value: 8, message: "Max 8 characters allowed" },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
        <br />

        <button
          disabled={isSubmitting}
          className="m-3 cursor-pointer bg-amber-950 text-amber-300 p-2 rounded-lg"
          type="submit"
        >
          Submit
        </button>
      </form>

      {message && <p className="m-4 text-green-500 text-xl">{message}</p>}

      {/* ✅ User List Table */}
      <h2 className="text-xl font-semibold mt-6">Users List</h2>
      <table className="border-collapse border border-gray-500 mt-4 w-full">
        <thead>
          <tr>
            <th className="border border-gray-500 px-4 py-2">Name</th>
            <th className="border border-gray-500 px-4 py-2">Password</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td className="border border-gray-500 px-4 py-2">{user.name}</td>
                <td className="border border-gray-500 px-4 py-2">
                  {user.password}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center py-2">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;
