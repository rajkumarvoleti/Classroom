import {
  banner1,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6,
} from "../lib/bannerUrls";
import ImagePicker from "react-image-picker";
import "react-image-picker/dist/index.css";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

const Images = [banner1, banner2, banner3, banner4, banner5, banner6];

const style = {
  margin: "5px",
  ".heading": {
    pl: "15px",
    margin: "10px",
    fontSize: "16px",
  },
  ".image_picker .responsive img": {
    width: "150px !important",
    height: "auto !important",
  },
  ".image_picker .selected .checked .icon": {
    width: "30px",
    height: "30px",
  },
};

export default function ImagePickerComp({ setBanner }) {
  const handleImageSelect = (image) => {
    setBanner(image.src);
  };
  return (
    <Box sx={style}>
      <Typography className="heading">Select a banner</Typography>
      <ImagePicker
        images={Images.map((image, i) => ({ src: image, value: i }))}
        onPick={handleImageSelect}
      />
    </Box>
  );
}
