import React, { Suspense } from 'react';
import { useTea } from '../contexts/TeaContext';

const TeaOverview = React.lazy(() => import('../components/Dashboard/TeaOverview'));
const TeaInsights = React.lazy(() => import('../components/Dashboard/TeaInsights'));
const ShoppingList = React.lazy(() => import('../components/ShoppingList/ShoppingList'));

const HomePage = () => {
  const { teas } = useTea();

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>
      <div className="page-content">
        <Suspense fallback={<div className="loading-skeleton">Loading...</div>}>
          <TeaOverview />
          <ShoppingList teas={teas} />
          <TeaInsights teas={teas} />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
