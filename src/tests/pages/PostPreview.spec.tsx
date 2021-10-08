import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { mocked } from "ts-jest/utils";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "slug-example",
  title: "title-example",
  content: "<p>content-example</p>",
  updatedAt: "01-01-2021",
};

jest.mock("next/router");
jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe("Post preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreview post={post} />);

    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
    expect(screen.getByText("title-example")).toBeInTheDocument();
    expect(screen.getByText("content-example")).toBeInTheDocument();
  });

  it("redirects customer to full post when customer is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: "fake-active-subscription" },
      false,
    ] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMock).toBeCalledWith("/posts/slug-example");
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

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

    const response = await getStaticProps({
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
