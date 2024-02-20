"use client";

import { useState, useEffect } from "react";
import addToRegistery from "@/actions/waitlist/regsitery";
import Fade from "@/components/design/fade/fade";
import Button from "../design/button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [correctMail, setCorrectMail] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [showApiErrors, setShowApiErrors] = useState(false);
  const [apiErrors, setApiErrors] = useState([]);
  const [submitting, isSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [renderFrom, setRenderForm] = useState(true);
  const [renderResult, setRenderResult] = useState(false);

  useEffect(() => {
    if (regSuccess) {
      setRenderForm(false);
      setTimeout(() => {
        setRenderResult(true);
      }, 400);
    }
  }, [regSuccess]);

  function onChangeEmail(e) {
    setEmail(e.target.value);
    if (e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      setCorrectMail(true);
    } else {
      setCorrectMail(false);
    }
  }

  async function register() {
    isSubmitting(true);

    try {
      if (correctMail) {
        setShowWarnings(false);
        const res = await addToRegistery(email);

        if (res.success === true) {
          setEmail("");
          setShowApiErrors(false);
          setRegSuccess(true);
        } else {
          setShowApiErrors(true);
          setApiErrors(res.message);
        }
      } else {
        setShowApiErrors(false);
        setShowWarnings(true);
      }
    } catch (err) {
      setApiErrors(["something wrong, in our side. please come back later."]);
      console.error(err);
    }
    isSubmitting(false);
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div className="basis-11/12 md:basis-3/4 lg:basis-1/2">
        <Fade show={renderFrom}>
          <form className="bg-tock-semiblack rounded-2xl p-4 pb-8 mb-4">
            <h1 className="mb-2 mt-6 text-xl font-bold text-tock-green">
              JOIN TOCKABLE
            </h1>
            <p className="text-xs text-zinc-400 mb-12">
              Maybe one email per year.
            </p>
            <div className="mb-10">
              <label className="block text-tock-blue text-sm font-bold mb-2">
                Email
                {/* <span className="text-tock-red"> *</span> */}
              </label>
              <input
                className="appearance-none bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
                value={email}
                id="email"
                type="text"
                placeholder="me@mail.me"
                onChange={onChangeEmail}
                required
              />
            </div>

            <div className="flex justify-center sm:justify-start">
              <Button
                variant="primary"
                type="button"
                disabled={submitting}
                onClick={() => {
                  register();
                }}
              >
                Join Tockable!
              </Button>
            </div>

            {showWarnings && (
              <div className="mt-6 text-sm">
                {!correctMail && (
                  <div className="border border-tock-red rounded-2xl p-4 mb-4">
                    <p className="text-tock-red">
                      - Email address seems not correct.
                    </p>
                  </div>
                )}
                {correctMail && (
                  <div className="border border-tock-green rounded-2xl opacity-80 p-4">
                    <p className="text-tock-green">
                      - Email address format: OK
                    </p>
                  </div>
                )}
              </div>
            )}
            {showApiErrors && apiErrors.length > 0 && (
              <div className="mt-6 text-sm">
                {apiErrors.map((err, i) => {
                  return (
                    <div className="border border-tock-red rounded-2xl p-4 mb-4 opacity:80">
                      <p className="text-tock-red" id={i}>
                        {err}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </form>
        </Fade>
        <Fade show={renderResult}>
          <div className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
            <h1 className="mb-2 text-xl font-bold text-tock-green">
              Thank you for Joining us!
            </h1>
            <p className="mb-12 text-zinc-200 text-sm">
              We will not spam! maybe 1 or 2 e-mails in a year!
            </p>
          </div>
        </Fade>
        <p className="text-center text-gray-500 text-xs">
          &copy;2024 Tockable. All rights reserved.
        </p>
      </div>
    </div>
  );
}
