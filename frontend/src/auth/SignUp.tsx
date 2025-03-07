import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../sevices/authentication";
import { useNavigate } from "react-router-dom";
interface FormValues {
  name: string;
  email: string;
  password: string;
}


const SignUp: React.FC = () => {
  const navigate = useNavigate()
  const [isSignUpComplete, setIsSignUpComplete] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<FormValues>();
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true);
  
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
   const token = await signup(data.name,data.email, data.password);
    if (!token) {
      alert("error");
      return;
    }
    localStorage.setItem("userToken", token);
    setIsSignUpComplete(true);
    navigate("/");
  };

  return (
    <>
      {isSignUpComplete ? (
        <div>
          complete
          <Link to={"/login"}>Continue</Link>
        </div>
      ) : (
        <div className="size-full flex justify-center items-center">
          <form
            className="border border-blue-300  h-2.5/4 w-2/4 rounded p-4 flex flex-col flex-wrap space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label
              htmlFor="username"
              className="font-semibold text-lg text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              placeholder="Enter username"
              className="w-64 border border-sky-500 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              {...register("name", { required: true })}
            />

            <label
              htmlFor="email"
              className="font-semibold text-lg text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              className="w-64 border border-sky-500 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              {...register("email", { required: true })}
            />
            <label
              htmlFor="email"
              className="font-semibold text-lg text-gray-700"
            >
              Password
            </label>
            <div>
              <input
                id="password"
                type={passwordVisibility ? "password" : ""}
                placeholder="Enter Password"
                className="ml-1 w-48 border border-sky-500 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                {...register("password", { required: true })}
              />{" "}
              <button
                type="button"
                onClick={() => setPasswordVisibility(!passwordVisibility)}
              >
                {passwordVisibility ? "Show" : "Hide"}
              </button>
            </div>

            <button
              type="submit"
              className="w-20 bg-sky-500 text-white p-2 rounded-md hover:bg-sky-600 transition-colors"
            >
              <h4>Create</h4>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SignUp;
