import { People } from "@prisma/client";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
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
  let { _action, ...values } = Object.fromEntries(formData);
  if (_action === "create") {
    const people = await db.people.create({ data: values });
    return people;
  }
  if (_action === "delete") {
    return db.people.delete({
      where: { id: values.id },
    });
  }
};
export default function Index() {
  let { people } = useLoaderData<LoaderData>();
  let transition = useTransition();
  let isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "create";

  let formRef = useRef();
  let firstNameRef = useRef();
  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      firstNameRef.current?.focus();
    }
  }, [isAdding]);
  return (
    <main>
      <h1>People</h1>
      <ul>
        {people.sort(byCreatedAt).map((person) => (
          <PersonItem key={person.id} person={person} />
        ))}
        <li>
          <Form ref={formRef} method="post">
            <input type="text" name="firstName" ref={firstNameRef} />
            <input type="text" name="lastName" />
            <button
              type="submit"
              name="_action"
              value="create"
              disabled={isAdding}
            >
              {isAdding ? "Creating..." : "Create"}
            </button>
          </Form>
        </li>
      </ul>
    </main>
  );
}

function PersonItem({ person }: { person: People }) {
  let fetcher = useFetcher();
  let isDeleting = fetcher.submission?.formData?.get("id") === person.id;
  return (
    <li
      style={{
        opacity: isDeleting ? 0.25 : 1,
      }}
      key={person.id}
    >
      {person.firstName} {person.lastName}{" "}
      <fetcher.Form
        style={{
          display: "inline",
        }}
        method="post"
      >
        <input type="hidden" name="id" value={person.id} />
        <input type="hidden" name="createdAt" value={person.createdAt} />
        <button type="submit" aria-label="delete" name="_action" value="delete">
          x
        </button>
      </fetcher.Form>
    </li>
  );
}

let byCreatedAt = (a: People, b: People) =>
  new Date(a.createdAt) - new Date(b.createdAt);
