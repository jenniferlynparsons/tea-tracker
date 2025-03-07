import React from 'react';
import { Link } from 'react-router-dom';
import { Tea } from '../../types/Tea';
import './TeaInsights.css';

interface TeaInsightsProps {
  teas: Tea[];
}

const TeaInsights: React.FC<TeaInsightsProps> = ({ teas }) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

  const getRecommendations = () => {
    const unbrewedTeas = teas.filter(tea => !tea.lastBrewed);
    const notRecentlyBrewed = teas.filter(tea => {
      if (!tea.lastBrewed) return false;
      return new Date(tea.lastBrewed) < thirtyDaysAgo;
    });
    const highlyRated = teas
      .filter(tea => tea.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating);

    return {
      unbrewed: unbrewedTeas.slice(0, 3),
      forgotten: notRecentlyBrewed.slice(0, 3),
      favorites: highlyRated.slice(0, 3)
    };
  };

  const recommendations = getRecommendations();

  return (
    <div className="tea-insights" role="complementary">
      <h3>Recommendations</h3>
      
      <div className="recommendations-grid">
        {recommendations.unbrewed.length > 0 && (
          <section className="recommendation-section" aria-labelledby="new-teas-heading">
            <h4 id="new-teas-heading">Try Something New</h4>
            <ul>
              {recommendations.unbrewed.map(tea => (
                <li key={tea.id}>
                  <Link to={`/tea/${tea.id}`} className="tea-recommendation">
                    <span className="tea-name">{tea.name}</span>
                    <span className="tea-type">{tea.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {recommendations.forgotten.length > 0 && (
          <section className="recommendation-section" aria-labelledby="forgotten-teas-heading">
            <h4 id="forgotten-teas-heading">Rediscover These</h4>
            <ul>
              {recommendations.forgotten.map(tea => (
                <li key={tea.id}>
                  <Link to={`/tea/${tea.id}`} className="tea-recommendation">
                    <span className="tea-name">{tea.name}</span>
                    <span className="last-brewed">
                      Last brewed: {new Date(tea.lastBrewed!).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {recommendations.favorites.length > 0 && (
          <section className="recommendation-section" aria-labelledby="favorite-teas-heading">
            <h4 id="favorite-teas-heading">Your Favorites</h4>
            <ul>
              {recommendations.favorites.map(tea => (
                <li key={tea.id}>
                  <Link to={`/tea/${tea.id}`} className="tea-recommendation">
                    <span className="tea-name">{tea.name}</span>
                    <span className="rating">★ {tea.rating}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default TeaInsights;
