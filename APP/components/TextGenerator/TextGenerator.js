import React, { useEffect, useState } from "react";
import axios from "axios";
import sal from "sal.js";
import Image from "next/image";
import TextGeneratorData from "../../data/dashboard.json";
import Reaction from "../Common/Reaction";
import StaticbarDashboard from "../Common/StaticbarDashboard"; // Import StaticbarDashboard
import styles from "./TextGenerator.module.css";

const TextGenerator = ({ selectedModel }) => {
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState('.'); // State to manage loading dots

  useEffect(() => {
    sal();
    const cards = document.querySelectorAll(".bg-flashlight");
    cards.forEach((bgflashlight) => {
      bgflashlight.onmousemove = function (e) {
        let x = e.pageX - bgflashlight.offsetLeft;
        let y = e.pageY - bgflashlight.offsetTop;
        bgflashlight.style.setProperty("--x", x + "px");
        bgflashlight.style.setProperty("--y", y + "px");
      };
    });

    if (loading) {
      const interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
      }, 500);

      return () => clearInterval(interval);
    }
  }, [selectedModel, loading]);

  const handleInputChange = (e) => {
    setIngredient(e.target.value);
  };

  const addIngredient = () => {
    if (ingredient.trim() !== '') {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient('');
    }
  };

  const handleSubmit = async () => {
    if (ingredients.length === 0) {
      alert("Please enter 1 or more ingredients to generate recipes.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get('http://127.0.0.1:5000/recipe', {
        params: { ingredients: ingredients.join(' ') }
      });
      const recipesData = Object.values(response.data).map((recipe, index) => ({
        title: recipe.recipe,
        description: `Score: ${recipe.score}, Ingredients: ${recipe.ingredients}, URL: ${recipe.url}`
      }));
      setRecipes(recipesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  const resetInterface = () => {
    setIngredients([]);
    setRecipes([]);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Generating Recipes{loadingDots}</p>
      </div>
    );
  }

  if (recipes.length > 0) {
    return (
      <div className={styles.recipesContainer}>
        <h2>Recipes</h2>
        <div className={styles.recipeResults}>
          {recipes.map((recipe, index) => (
            <div key={index} className={styles.recipe}>
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <a href={recipe.url} target="_blank" rel="noopener noreferrer">View Recipe</a>
            </div>
          ))}
        </div>
        <button onClick={resetInterface} className={styles.generateMoreButton}>Generate More</button>
      </div>
    );
  }

  if (selectedModel === 'basicModel') {
    return (
      <>
        <div className={styles.inputSection}>
          <label className={styles.inputLabel}>
            Enter ingredient:
            <input 
              type="text" 
              value={ingredient} 
              onChange={handleInputChange} 
              className={styles.inputBox}
            />
          </label>
          <button onClick={addIngredient} className={styles.addButton}>Add Ingredient</button>
        </div>
        <div className={styles.ingredientsBox}>
          <h3>Ingredients List</h3>
          <ul>
            {ingredients.map((ing, index) => (
              <li key={index}>{ing}</li>
            ))}
          </ul>
        </div>
        <button onClick={handleSubmit} className={styles.getRecipesButton}>Get Recipes</button>
      </>
    );
  } else if (selectedModel === 'advancedModel') {
    const modelData = TextGeneratorData.textGenerator[0].advancedModel;
    return (
      <>
        {modelData && modelData.textGenerator.map((data, index) => (
          <div
            className="chat-box-list pt--30"
            id="chatContainer"
            data-sal="slide-up"
            data-sal-duration="700"
            data-sal-delay="100"
            key={index}
          >
            <div className="chat-box author-speech bg-flashlight">
              <div className="inner">
                <div className="chat-section">
                  <div className="author">
                    <Image
                      className="w-100"
                      width={40}
                      height={40}
                      src={data.author}
                      alt="Author"
                    />
                  </div>
                  <div className="chat-content">
                    <h6 className="title">{data.title}</h6>
                    <p>{data.desc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="chat-box ai-speech bg-flashlight">
              {data.content.map((innerData, innerIndex) => (
                <div
                  className="inner top-flashlight leftside light-xl"
                  key={innerIndex}
                >
                  <div className="chat-section generate-section">
                    <div className="author">
                      <Image
                        src={innerData.img}
                        width={40}
                        height={40}
                        alt="Loader Images"
                      />
                    </div>
                    <div className="chat-content">
                      <h6 className="title color-text-off mb--0">
                        {innerData.text}
                      </h6>
                    </div>
                  </div>
                  <div className="chat-section">
                    <div className="author">
                      <Image
                        className="w-100"
                        src={innerData.aiImg}
                        width={40}
                        height={40}
                        alt="ChatenAI"
                      />
                    </div>
                    <div className="chat-content">
                      <h6 className="title">
                        {innerData.title}
                        <span className="rainbow-badge-card">
                          {innerData?.badge}
                        </span>
                      </h6>
                      {innerData.desc2 ? (
                        <p className="">{innerData.desc2}</p>
                      ) : (
                        ""
                      )}
                      <p className="mb--20">{innerData.desc}</p>
                      <Reaction />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <StaticbarDashboard /> {/* Render StaticbarDashboard only in advanced model */}
      </>
    );
  } else {
    return null;
  }
};

export default TextGenerator;
