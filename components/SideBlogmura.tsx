import React from 'react';
import { BlogmuraButtons } from './BlogmuraButtons';

export const SideBlogmura: React.FC = () => {
    return (
        <>
            <div className="side-blogmura-container left">
                <BlogmuraButtons orientation="vertical" />
            </div>
            {/* Only one side needed or both? Usually sidebars are mirrored or single. 
                 The SideAd component has 'left' and 'right'. 
                 I'll put Blogmura on the LEFT bottom, leaving RIGHT for something else if needed, 
                 or replicate on both sides if it looks balanced. 
                 Let's put it on both sides for symmetry as requested implicitly by "Sidebar" plural context usually.
                 Actually, let's put it on the Left side primarily, or maybe split them?
                 The user didn't specify split. I will put all buttons on the LEFT side for now, 
                 as stacking 6 buttons vertically is quite tall (31px * 6 + gaps = ~250px).
                 If I put them on both sides it might be too much. 
                 Let's try putting them on the LEFT bottom.
             */}

            <style jsx>{`
        .side-blogmura-container {
          position: fixed;
          bottom: 20px;
          width: 120px; /* Slightly wider than 88px buttons */
          z-index: 10;
          display: none; /* Hidden on small screens */
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
          border-radius: 8px;
          padding: 10px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .side-blogmura-container.left {
          left: 10px;
        }

        /* Large screens only - match SideAd breakpoint */
        @media (min-width: 1400px) {
          .side-blogmura-container {
            display: block;
          }
        }
      `}</style>
        </>
    );
};
