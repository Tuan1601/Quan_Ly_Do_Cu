import React from "react";
import { Carousel } from "antd";
import img1 from "../../../../images/best-camera-for-entry-level-4.jpeg";
import img2 from "../../../../images/manhinhmaytinhchoigame-tuyentap-thumb.jpg";
import img3 from "../../../../images/may-chieu-vankyo-co-tot-khong-2.jpg";

const bannerImages = [img1, img2, img3];

const Banner: React.FC = () => (
  <Carousel autoplay effect="fade" arrows style={{ borderRadius: 16, overflow: "hidden" }}>
    {bannerImages.map((src, idx) => (
      <div key={idx}>
        <img
          src={src}
          alt={`banner-${idx}`}
          style={{ width: "100%", height: 400, objectFit: "cover" }} // Tăng chiều cao
        />
      </div>
    ))}
  </Carousel>
);

export default Banner;
