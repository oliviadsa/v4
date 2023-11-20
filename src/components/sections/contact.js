import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(25px, 2vw, 35px);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const StyleContactForm = styled.form`
  display: flex;
  flex-direction: column;

  div {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;

    label {
      color: var(--white);
      text-align: left;
      margin-bottom: 0.5rem; /* Optional: Add some spacing between label and input */
    }

    input,
    textarea {
      background-color: var(--dark-navy);
      border: 1px solid var(--lightest-slate);
      width: 100%;
      color: var(--white);
      font-size: 1rem;
      padding: 0.375rem 0.75rem;
      &:focus {
        border: 1px solid var(--green);
      }
    }
    input {
      height: calc(1.5em + 0.75rem + 2px);
    }
    textarea {
      min-height: 100px;
      resize: vertical;
    }
    .submit-button {
      ${({ theme }) => theme.mixins.button};
      margin: 20px auto 0;
    }
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledContactSection id="hireme" ref={revealContainer}>
      <h2 className="numbered-heading overline">Let's Connect?</h2>

      <h6 className="title">I am open to work and looking for Project/Product Management roles.</h6>
      <h6 className="title">Have something for me?</h6>
      <StyleContactForm action="https://api.web3forms.com/submit" method="POST">
        <input type="hidden" name="access_key" value="32ffdd00-c08d-4b85-af1c-4e1dcf97d5b5" />
        <div>
          <label>
            Name <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Email <input type="email" name="email" />
          </label>
        </div>
        <div>
          <label>
            Company Website <input type="url" name="url" />
          </label>
        </div>
        <div>
          <label>
            Short description of the opportunity <textarea name="description" />
          </label>
        </div>
        <div>
          <button className="submit-button">Submit</button>
        </div>
      </StyleContactForm>
    </StyledContactSection>
  );
};

export default Contact;
