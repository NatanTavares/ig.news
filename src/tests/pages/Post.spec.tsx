import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "slug-example",
  title: "title-example",
  content: "<p>content-example</p>",
  updatedAt: "01-01-2021",
};

jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("title-example")).toBeInTheDocument();
    expect(screen.getByText("content-example")).toBeInTheDocument();
  });

  it("redirects customer if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: "slug-example" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: "/",
          permanent: false,
        },
      })
    );
  });

  it("loads initial adata", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    });

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: "heading",
              text: "title-example",
            },
          ],
          content: [
            {
              type: "paragraph",
              text: "content-example",
            },
          ],
        },
        last_publication_date: "01-01-2021",
      }),
    } as any);

    const response = await getServerSideProps({
      params: { slug: "slug-example" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "slug-example",
            title: "title-example",
            content: "<p>content-example</p>",
            updatedAt: "01 de janeiro de 2021",
          },
        },
      })
    );
  });
});
