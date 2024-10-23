import React, { useState } from "react";
import AccordionData from "../../data/home.json";
import styles from "./AccordionItem.module.css"; // Assuming you have a CSS module for custom styles

const AccordionItem = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Default to the first item

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.customAccordion}>
      {AccordionData &&
        AccordionData.accordion.map((data, index) => (
          <div
            className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ""}`}
            key={index}
          >
            <h2
              className={styles.accordionHeader}
              onClick={() => handleAccordionClick(index)}
            >
              {data.title}
            </h2>
            <div
              className={`${styles.accordionContent} ${activeIndex === index ? styles.show : ""}`}
            >
              {data.desc}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AccordionItem;
