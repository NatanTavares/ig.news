import Posts, { getStaticProps } from "../../pages/posts/index";
import { getPrismicClient } from "../../services/prismic";
import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

jest.mock("../../services/prismic");

const postsExample = [
  {
    slug: "slug-example",
    title: "title-example",
    excerpt: "excerpt-example",
    updatedAt: "01-01-2021",
  },
];

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Posts posts={postsExample} />);

    expect(screen.getByText("title-example")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "slug-example",
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
                  text: "excerpt-example",
                },
              ],
            },
            last_publication_date: "01-01-2021",
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "slug-example",
              title: "title-example",
              excerpt: "excerpt-example",
              updatedAt: "01 de janeiro de 2021",
            },
          ],
        },
      })
    );
  });
});
