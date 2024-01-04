import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";


const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  location: yup.string().required("required"),
  major: yup.string().required("required"),
  age: yup.number().required("required"),
  gender: yup.string().required("required"),
  picturePath: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  location: "",
  email: "",
  major: "",
  age: "",
  gender: "",
  picturePath: ""
};


const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (loggedInResponse.status === 404) {
      setPageType("register");
      return;
    }

    const loggedIn = await loggedInResponse.json();
    console.log(loggedIn);
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  return (
    <Formik
      onSubmit={register}
      enableReinitialize={true}
      initialValues={initialValuesRegister}
      validationSchema={registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Age"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.age}
                  name="age"
                  error={Boolean(touched.age) && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Gender"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.gender}
                  name="gender"
                  error={Boolean(touched.gender) && Boolean(errors.gender)}
                  helperText={touched.gender && errors.gender}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Campus Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Major"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.major}
                  name="major"
                  error={
                    Boolean(touched.major) && Boolean(errors.major)
                  }
                  helperText={touched.major && errors.major}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  disabled
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}
            {isRegister ? 
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >REGISTER
              </Button>
            :
              <GoogleLogin
              onSuccess={credentialResponse => {
                const token = jwt_decode(credentialResponse.credential)
                console.log(token)
                initialValuesRegister.email = token.email;
                initialValuesRegister.firstName = token.given_name;
                initialValuesRegister.lastName = token.family_name;
                initialValuesRegister.email = token.email;
                initialValuesRegister.picturePath = token.picture;
                login({token: credentialResponse.credential});
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              size="medium"
              useOneTap
            />
            }
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;