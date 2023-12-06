import React, { useState, useRef, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { Icon } from '@components/icons';

const StyledRecommendationSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }
  .container {
    position: relative;
    width: 100%;
    display: flex;
  }
  .arrows {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    .count {
      margin: 5px 15px 0;
    }
    .left-arrow,
    .right-arrow {
      width: 10px;
      height: 10px;
      display: block;
      border-top: 1px solid var(--green);
      border-left: 1px solid var(--green);
      transform: rotate(-45deg);
      background-color: inherit;
      &:hover {
        border-top: 2px solid var(--green);
        border-left: 2px solid var(--green);
      }
      &.disabled {
        border-top: 1px solid var(--light-slate);
        border-left: 1px solid var(--light-slate);
        cursor: not-allowed;
      }
    }
    .right-arrow {
      transform: rotate(135deg);
    }
  }
`;

const StyledReccommendation = styled.div`
  position: absolute;
  top: 0px;
  transition: left 0.5s linear;
  width: 95%;
  display: flex;
  justify-content: center;

  a {
    position: relative;
    z-index: 1;
    &:hover {
      color: var(--white);
    }
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    justify-content: flex-start;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-right: 25px;
  }
  .project-title {
    font-size: clamp(24px, 5vw, 28px);
    margin: 0;
  }

  .project-overline {
    margin: 10px 0;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 400;
    margin: 0;
    svg {
      width: 15px;
      height: 15px;
      margin-top: -5px;
    }
  }
  .project-description {
    max-width: 550px;
  }
  .show-all {
    .project-description {
    }
  }
`;

const reccomendationsInner = (node, currSlideRef) => {
  const { frontmatter, html } = node;
  const { Author, company, LinkedIn, profilePic, position } = frontmatter;
  const image = getImage(profilePic);

  return (
    <div className="project-inner" ref={currSlideRef}>
      <div className="project-top">
        <GatsbyImage
          image={image}
          alt={Author}
          className="img"
          imgStyle={{ borderRadius: '50%' }}
        />
      </div>
      <div className="content">
        <h3 className="project-title">{Author}</h3>
        <a href={LinkedIn} target="__blank" className="project-overline">
          {' '}
          {position}, {company} <Icon name="External" />
        </a>
        <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default function Reccomendations() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [height, setHeight] = useState(0);
  const currSlideRef = useRef(null);

  useEffect(() => {
    setHeight(currSlideRef.current.clientHeight);
  });

  const data = useStaticQuery(graphql`
    query {
      reccomendations: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/reccomendations/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              Author
              company
              LinkedIn
              position
              profilePic {
                childImageSharp {
                  gatsbyImageData(width: 96, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
            }
            html
          }
        }
      }
    }
  `);

  const reccomendations = data.reccomendations.edges.filter(({ node }) => node);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = e => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = e => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && currentSlide !== reccomendations.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (isRightSwipe && currentSlide !== 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <StyledRecommendationSection id="reccommendations">
      <h2 className="numbered-heading">Reccomendations</h2>
      <div className="arrows">
        <button
          className={`left-arrow ${currentSlide === 0 ? 'disabled' : ''}`}
          disabled={currentSlide === 0}
          onClick={() => setCurrentSlide(currentSlide - 1)}></button>
        <span className="count">
          {currentSlide + 1} / {reccomendations.length}
        </span>
        <button
          className={`right-arrow ${currentSlide === reccomendations.length - 1 ? 'disabled' : ''}`}
          disabled={currentSlide === reccomendations.length - 1}
          onClick={() => setCurrentSlide(currentSlide + 1)}></button>
      </div>
      <div
        className="container"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        style={{
          height: height,
        }}>
        {reccomendations &&
          reccomendations.map(({ node }, i) => (
            <StyledReccommendation
              key={i}
              style={{
                left: i === currentSlide ? '0' : `${(i - currentSlide) * 1000}px`,
              }}>
              {reccomendationsInner(node, i === currentSlide ? currSlideRef : null)}
            </StyledReccommendation>
          ))}
      </div>
    </StyledRecommendationSection>
  );
}
