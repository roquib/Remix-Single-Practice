import { People } from "@prisma/client";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  people: Array<People>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    people: await db.people.findMany(),
  };
  return json(data);
};
export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let values = Object.fromEntries(formData);
  const people = await db.people.create({ data: values });
  return people;
};
export default function Index() {
  let { people } = useLoaderData<LoaderData>();

  return (
    <main>
      <h1>People</h1>
      {people.length ? (
        <ul>
          {people.map((person) => (
            <li key={person.id}>
              {person.firstName} {person.lastName}
            </li>
          ))}
          <li>
            <Form method="post">
              <input type="text" name="firstName" />
              <input type="text" name="lastName" />
              <button type="submit">Add</button>
            </Form>
          </li>
        </ul>
      ) : (
        <p>No people found</p>
      )}
    </main>
  );
}
