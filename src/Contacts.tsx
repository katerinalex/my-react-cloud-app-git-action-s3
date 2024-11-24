/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
import React, { useState } from 'react';

export const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<string[]>([]);
  const [email, setEmail] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbwfC07MCTZIPaeriE06NqWaiyrYnUjJP_YrAtwqXTljzNGBLzvMHsmOi5_LGN1k6xk/exec';

  const addingEmailHandler = () => {
    // setContacts(prev => [...prev, email]);
    // setEmail('');

    setTimeout(() => {
      fetch(scriptUrl, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ emails: email }) })
        .then((result) => {
          // mode: 'no-cors' body: JSON.stringify(d)
          // eslint-disable-next-line no-console
          console.log('SUCCESSFULLY SUBMITTED');
          // eslint-disable-next-line no-console
          console.log(result);
          setEmail('');
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log(err));
    }, 10);
  };

  const loadingContactsHandler = () => {
    setIsLoaded(true);

    setTimeout(() => {
      fetch(scriptUrl, { method: 'GET' })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setContacts(res);
          setIsLoaded(true);
        })
      // eslint-disable-next-line no-console
        .catch(err => console.log(err));
    }, 1);
  };

  const hidingContactsHandler = () => {
    setIsLoaded(false);
    setContacts([]);
  };

  return (
    <>
      <div className="">
        <h2>Usefull emails</h2>
        <label htmlFor="email">Enter your example.com email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(String(e.target.value))}
        />
        <button type="button" onClick={addingEmailHandler}>Add email to your contacts</button>
        <button type="button" onClick={loadingContactsHandler}>Load all your contacts</button>
        <button type="button" onClick={hidingContactsHandler}>Hide all your contacts</button>
        <div>
          {isLoaded && (
            contacts.map((el, i) => (
              <p key={i}>{el}</p>
            ))
          )}
        </div>
      </div>
    </>
  );
};
