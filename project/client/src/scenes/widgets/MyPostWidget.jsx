import {
    EditOutlined,
    DeleteOutlined,
    GifBoxOutlined,
    ImageOutlined,
    RefreshOutlined
  } from "@mui/icons-material";
  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
  } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Dropzone from "react-dropzone";
  import UserImage from "components/UserImage";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "state";
  
  const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [isGif, setIsGif] = useState(false);
    const [image, setImage] = useState(null);
    const [gif, setGif] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
    const weather = useSelector((state) => state.user.weather);
  
    const weatherCodes = {
      0: "Happy",
      1: "Playing",
      2: "Sleeping",
      3: "Cry",
      45: "Mystery",
      51: "Tea",
      53: "Soup",
      55: "Umbrella",
      61: "Stream",
      63: "Lake",
      65: "Ocean",
      66: "Chittering",
      67: "Misery",
      71: "Dance",
      73: "Snow",
      75: "Frozen",
      80: "Shower",
      81: "Flood",
      82: "Fight",
      85: "Sweater",
      86: "Fireplace",
      95: "Lightning",
      96: "Dodgeball",
      99: "Helmet"
    }

    const handlePost = async () => {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }
      if (gif) {
        formData.append("picturePath", gif);
      }
  
      const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const posts = await response.json();
      posts.reverse(); // Show newest first
      dispatch(setPosts({ posts }));
      setImage(null);
      setPost("");
    };

    const getRandomGif = async () => {
      const giphy = {
        baseURL: "https://api.giphy.com/v1/gifs/",
        apiKey: "0UTRbFtkMxAplrohufYco5IY74U8hOes",
        tag: weather ? weatherCodes[weather.current_weather.weathercode] : "fail",
        type: "random",
        rating: "pg-13"
      };
      let giphyURL = encodeURI(
        giphy.baseURL +
          giphy.type +
          "?api_key=" +
          giphy.apiKey +
          "&tag=" +
          giphy.tag +
          "&rating=" +
          giphy.rating
      );
      const response = await fetch(giphyURL, {
        method: "GET",
      });
      const gifyData = await response.json();
      setGif(gifyData.data.images.original.url);
    };

    const toggleGif = async () => {
      setIsGif(!isGif);
      await getRandomGif();
    }
  
    return (
      <WidgetWrapper>
        <FlexBetween gap="1.5rem">
          <UserImage image={picturePath} />
          <InputBase
            placeholder="What's on your mind..."
            onChange={(e) => setPost(e.target.value)}
            value={post}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />
        </FlexBetween>
        {isImage && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!image ? (
                      <p>Add Image Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                  {image && (
                    <IconButton
                      onClick={() => setImage(null)}
                      sx={{ width: "15%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}
        {isGif && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
          <FlexBetween>
            <Box>
              {!gif ? ( ""
              ) : (
                <FlexBetween>
                  <img
                    alt=""
                    src={gif}
                  />
                </FlexBetween>
              )}
            </Box>
            {gif && (
              <IconButton
                onClick={() => getRandomGif(null)}
                sx={{ width: "15%" }}
              >
                <RefreshOutlined />
              </IconButton>
            )}
          </FlexBetween>
          </Box>
        )}
  
        <Divider sx={{ margin: "1.25rem 0" }} />
  
        <FlexBetween>
          <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Image
            </Typography>
          </FlexBetween>
  
            <>
              <FlexBetween gap="0.25rem" onClick={() => toggleGif()}>
                <GifBoxOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Gif</Typography>
              </FlexBetween>
            </>
  
          <Button
            disabled={!post}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
        </FlexBetween>
      </WidgetWrapper>
    );
  };
  
  export default MyPostWidget;