import Separator from "@/pages/separator";
import Image from "next/image";
import Link from "next/link";

import logo from "../../public/images/logo/logo.png";
import logoDark from "../../public/images/logo/logo-dark.png";

import FooterData from "../../data/footer.json";
import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="rainbow-footer footer-style-default footer-style-3 position-relative">
        <Separator top={true} />
        <div className="footer-top">
          <div className="container">
            <div className="row justify-content-center mb--30">
              <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                <div className="rainbow-footer-widget text-center">
                  <div className="logo">
                    <Link href="/">
                      <Image
                        className="logo-light"
                        src={logo}
                        width={201}
                        height={35}
                        alt="Corporate Logo"
                      />
                      <Image
                        className="logo-dark"
                        src={logoDark}
                        width={201}
                        height={35}
                        alt="Corporate Logo"
                      />
                    </Link>
                  </div>
                  <p className="b1 text-center mt--20 mb--0">
                    Get Started and Transform Waste Today!
                  </p>
                </div>
              </div>
            </div>
            <div className="separator-animated animated-true mt--50 mb--50"></div>
            {FooterData &&
              FooterData.footer.map((data, index) => (
                <React.Fragment key={index}>
                  <div className="row">
                    <div className="col-lg-8 col-md-6 col-sm-12 col-12">
                      <div className="rainbow-footer-widget">
                        <h4 className="title">{"Intellisort"}</h4>
                        <div className="inner">
                          <h6 className="subtitle">{"AI Waste Solutions. Simplify Your Disposal."}</h6>
                        </div>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="rainbow-footer-widget">
                          <h4 className="title">{"Contact Us"}</h4>
                          <div className="inner">
                            <h6 className="subtitle">{"Have questions or feedback? Reach out to us!"}</h6>
                            <p>Email: <a href="mailto:gurkiratkhaira11@gmail.com">gurkiratkhaira11@gmail.com</a></p>
                            <p>Email: <a href="mailto:tanveer-di-mail">tanveer-di-mail</a></p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))
            }
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
