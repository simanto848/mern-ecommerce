import { Button } from "flowbite-react";
import { AiFillFacebook } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const FacebookAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFacebookClick = async () => {
    try {
      const res = await fetch("/api/auth/facebook", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleFacebookClick}
    >
      <AiFillFacebook className="w-6 h-6 mr-2" />
      Continue with Facebook
    </Button>
  );
};

export default FacebookAuth;
