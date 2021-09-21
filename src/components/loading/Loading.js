import React from "react";
import ReactLoading from "react-loading";

const Loading = ({ color, height, width, size }) => {
    return <ReactLoading type={"spin"} color={color || "#007bff"} height={height || size || 50} width={width || size || 50} />;
};

export default Loading;
