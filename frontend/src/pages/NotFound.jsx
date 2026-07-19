import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState/EmptyState';
import Button from '../components/Button/Button';
import { Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <EmptyState 
        icon={Search}
        title="Page Not Found"
        description="The page you are looking for doesn't exist or has been moved."
        action={
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
