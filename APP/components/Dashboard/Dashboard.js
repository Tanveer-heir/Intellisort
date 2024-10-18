import React, { useEffect } from "react";
import sal from "sal.js";

import BannerArea from "./BannerArea";

import Form from "@/pages/Form";
import Items from "./items";

const Dashboard = () => {
  useEffect(() => {
    sal();
  }, []);
  return (
    <>
      <div className="rbt-main-content mr--0">
        <div className="rbt-daynamic-page-content">
          <div className="rbt-dashboard-content">
            <div className="banner-area">
              <BannerArea />
            </div>
            <div className="content-page">
              <div className="chat-box-list">
                <div className="welcome-wrapper">
                  <div className="content-section">
                    <h4 className="title">👋 Welcome, User</h4>
                  </div>
                  <div className="btn-section">
                    <a
                      className="btn-default bg-solid-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#newchatModal"
                    >
                      <span className="icon pe-2">
                        <i className="feather-plus-circle"></i>
                      </span>
                      <span>New Chat</span>
                    </a>
                  </div>
                </div>
                <div className="rainbow-generartor-section rainbow-section-gap">
                  <div
                    className="section-title text-center sal-animate"
                    data-sal="slide-up"
                    data-sal-duration="700"
                    data-sal-delay="100"
                  >
                    <h4 className="subtitle ">
                      <span className="theme-gradient">CookBot</span>
                    </h4>
                    <h2 className="title w-600 mb--20">
                      Unleashing the Power of AI-Powered Cooking
                    </h2>
                    <p className="description b1">
                      Master Your Kitchen with Personalized Recipes{" "}
                      <br />
                      Pioneering the Future of Home Cooking.
                    </p>
                  </div>
                  <div className="genarator-section">
                    <ul className="genarator-card-group">
                      <Items />
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="rbt-static-bar collapse-width">
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
