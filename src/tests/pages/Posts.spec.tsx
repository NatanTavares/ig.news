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

describe("Post page", () => {
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
            uid: postsExample[0].slug,
            data: {
              title: [
                {
                  type: "heading",
                  text: postsExample[0].title,
                },
              ],
              content: [
                {
                  type: "paragraph",
                  text: postsExample[0].excerpt,
                },
              ],
            },
            last_publication_date: postsExample[0].updatedAt,
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
