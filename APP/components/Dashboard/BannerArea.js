import Image from "next/image";
import Slider from "react-slick";

import img1 from "../../public/images/slider-bg/slider-sm-01.png";
import img2 from "../../public/images/slider-bg/slider-sm-02.png";
import img3 from "../../public/images/slider-bg/slider-sm-03.png";

const BannerArea = () => {
  var settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    adaptiveHeight: true,
    cssEase: "linear",
  };
  return (
    <>
      <Slider
        {...settings}
        className="rainbow-slider-section slick-grid-15 rainbow-slick-dot sm-slider-carosel-activation"
      >
        <div className="chatenai-small-slider slide-single-layout">
          <div className="inner bg-one">
            <div className="content">
              <h4 className="title">Your AI Ally</h4>
              <p className="desc">Harness the power of AI for every challenge</p>
            </div>
            <div className="img-section">
              <Image src={img1} width={480} height={165} alt="sm slider img" />
            </div>
          </div>
        </div>
        <div className="chatenai-small-slider slide-single-layout">
          <div className="inner bg-three">
            <div className="content">
              <h4 className="title">Next-Gen Intelligence</h4>
              <p className="desc">
                Step into the future with cutting-edge technology
              </p>
            </div>
            <div className="img-section">
              <Image src={img3} width={390} height={165} alt="sm slider img" />
            </div>
          </div>
        </div>
        <div className="chatenai-small-slider slide-single-layout">
          <div className="inner bg-four">
            <div className="content">
              <h4 className="title">Elevate Your Culinary Game</h4>
              <p className="desc">Discover recipes with CookBot</p>
            </div>
            <div className="img-section">
              <Image src={img2} width={350} height={165} alt="sm slider img" />
            </div>
          </div>
        </div>
      </Slider>
    </>
  );
};

export default BannerArea;
