import React, { useState } from "react";
import PageHead from "../Head";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import RightpanelDashboard from "@/components/Common/RightpanelDashboard";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import Modal from "react-modal";
import TextGenerator from "@/components/TextGenerator/TextGenerator";
import Image from "next/image"; // Correct import

const TextGeneratorPage = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModelChange = (model) => {
    setSelectedModel(model);
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const modelData = [
    {
      img: "/images/generator-icon/text_line.png",
      title: "Basic Model",
      onClick: () => handleModelChange("basicModel")
    },
    {
      img: "/images/generator-icon/text_line.png",
      title: "Advanced Model",
      onClick: () => handleModelChange("advancedModel")
    },
    // Add more models here
  ];

  return (
    <>
      <PageHead title="Text Generator" />
      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="" />
            <PopupMobileMenu />
            <LeftpanelDashboard />
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Select Model"
              style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 },
                content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', zIndex: 1001, backgroundColor: '#be03fc' }
              }}
            >
              <h2 style={{ textAlign: "center", color: "white" }}>Select AI Model</h2>
              <div className="model-grid" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                {modelData.map((model, index) => (
                  <div key={index} className="genarator-card" onClick={model.onClick} style={{ cursor: "pointer" }}>
                    <div className="inner">
                      <div className="left-align">
                        <div className="img-bar">
                          <Image src={model.img} width={50} height={50} alt={model.title} />
                        </div>
                        <h5 className="title">{model.title}</h5>
                      </div>
                      <div className="right-align">
                        <div className="icon-bar">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-arrow-right"
                          >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Modal>
            {selectedModel ? (
              <>
                <div className="header" style={{ position: "fixed", top: "10px", right: "10px", zIndex: 1002 }}>
                  <button onClick={openModal} style={{ padding: "10px 20px", backgroundColor: "#0059ff", color: "white", border: "none", borderRadius: "5px" }}>
                    Change Model
                  </button>
                </div>
                <div className="rbt-main-content" style={{ paddingTop: "60px" }}>
                  <div className="rbt-daynamic-page-content">
                    <div className="rbt-dashboard-content">
                      <div className="content-page">
                        <TextGenerator selectedModel={selectedModel} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="model-selection" style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <h2 style={{ textAlign: "center" }}>Select AI Model</h2>
                <div className="model-grid" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                  {modelData.map((model, index) => (
                    <div key={index} className="genarator-card" onClick={model.onClick} style={{ cursor: "pointer" }}>
                      <div className="inner">
                        <div className="left-align">
                          <div className="img-bar">
                            <Image src={model.img} width={50} height={50} alt={model.title} />
                          </div>
                          <h5 className="title">{model.title}</h5>
                        </div>
                        <div className="right-align">
                          <div className="icon-bar">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-arrow-right"
                            >
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Context>
      </main>
    </>
  );
};

export default TextGeneratorPage;
