import React from "react";

type IFrame = {
  name?: string;
  src: string;
  width?: number | string;
  height?: number | string;
  frameborder?: number | string;
  allow?: string;
  allowfullscreen?: string;
};

const IFrame: React.FC<IFrame> = ({
  name,
  src,
  width = 500,
  height = 500,
  frameborder = 0,
  allow = "",
  allowfullscreen = "false"
}) => {
  const allowFullScreen = allowfullscreen === "false" ? false : true;
  if (!src) {
    return null;
  }
  return (
    <iframe
      name={name}
      src={src}
      width={Number(width)}
      height={Number(height)}
      frameBorder={Number(frameborder)}
      allow={allow}
      allowFullScreen={allowFullScreen}
    />
  );
};

export default IFrame;
