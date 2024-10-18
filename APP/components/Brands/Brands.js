import Image from "next/image";

import brand1 from "../../public/images/brand/brand-01.png";

const Brands = () => {
  return (
    <>
      <div className="rainbow-brand-area rainbow-section-gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="section-title text-center sal-animate"
                data-sal="slide-up"
                data-sal-duration="700"
                data-sal-delay="100"
              >
                <h4 className="subtitle ">
                  <span className="theme-gradient">Our Awesome School</span>
                </h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 mt--10">
              <div className="thumbnail" style={{ textAlign: "center" }}>
                <a href="https://www.themillenniumschools.com/tmsamritsar/" target="_blank" rel="noopener noreferrer">
                  <Image
                    className="radius"
                    src={brand1}
                    alt="split Images"
                    style={{ width: "40%" }}
                    draggable="false"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Brands;
