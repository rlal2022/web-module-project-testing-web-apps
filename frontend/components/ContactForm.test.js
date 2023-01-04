import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);

  const header = screen.getByText("Contact Form");

  expect(header).toBeInTheDocument();
  expect(header).toBeInTheDocument(/contact form/i);
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent(/contact form/i);
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  //arrange
  render(<ContactForm />);

  //act
  const firstnameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(firstnameInput, "word");

  const errorMessage = await screen.findAllByTestId("error");
  expect(errorMessage).toHaveLength(1);
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);

  const testSubmit = screen.getByRole("button");
  userEvent.click(testSubmit);

  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(3);
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);

  const firstnameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(firstnameInput, "firstname");

  const lastnameInput = screen.getByLabelText(/last name*/i);
  userEvent.type(lastnameInput, "lastname");

  const testSubmit = screen.getByRole("button");
  userEvent.click(testSubmit);

  await waitFor(() => {
    const errorMessage = screen.queryAllByTestId("error");
    expect(errorMessage).toHaveLength(1);
  });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);

  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, "test@test");

  const testSubmit = screen.getByRole("button");
  userEvent.click(testSubmit);

  await waitFor(() => {
    const errorMessage = screen.findByText(
      "email must be a valid email address"
    );
  });
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const lastnameInput = screen.getByLabelText(/last name*/i);
  userEvent.type(lastnameInput, "");

  const testSubmit = screen.getByRole("button");
  userEvent.click(testSubmit);

  const errorMessage = await screen.findByText(/lastName is a required field/i);

  expect(errorMessage).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);

  const firstnameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(firstnameInput, "firstname");

  const lastnameInput = screen.getByLabelText(/last name*/i);
  userEvent.type(lastnameInput, "lastname");

  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, "test@test.com");

  const testSubmit = screen.getByRole("button");
  userEvent.click(testSubmit);

  await waitFor(() => {
    const showfirstName = screen.queryByText("firstname");
    const showlastName = screen.queryByText("lastname");
    const showEmail = screen.queryByText("test@test.com");
    const showMessage = screen.queryByTestId("messageDisplay");

    expect(showfirstName).toBeInTheDocument();
    expect(showlastName).toBeInTheDocument();
    expect(showEmail).toBeInTheDocument();
    expect(showMessage).not.toBeInTheDocument();
  });
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);

  const firstnameInput = screen.getByLabelText(/first name*/i);
  userEvent.type(firstnameInput, "firstname");

  const lastnameInput = screen.getByLabelText(/last name*/i);
  userEvent.type(lastnameInput, "lastname");

  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, "test@test");

  const messageInput = screen.getByLabelText(/message*/i);
  userEvent.type(messageInput, "message");

  const testSubmit = screen.getByRole("button");
  userEvent.click(testSubmit);
});
