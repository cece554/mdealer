<template>
  <!-- Check blog posts exist -->
  <div v-if="posts.length !== 0" class="blog-main">
    <!-- Template for blog posts -->
    <b-collapse
      class="card"
      animation="slide"
      v-for="post in posts"
      :key="(post.id, index)"
      v-bind:post="post"
      :open="isOpen == index"
      @open="isOpen = index"
    >
      <div slot="trigger" slot-scope="props" :class="[ isOpen ? cardBorder : '', cardHeader]" role="button">
        <p class="card-header-post-number">
          <span class="created-at">{{
            $prismic.richTextAsPlain(post.data.num)}}</span>
        </p>
        <p class="card-header-title">
          {{ $prismic.richTextAsPlain(post.data.title) }}
        </p>
        <a class="card-header-icon">
          <div class="plus-sign">+</div>
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
        </a>
      </div>
      <div class="card-content">
        <div class="content">{{ getFirstParagraph(post) }}</div>
      </div>
    </b-collapse>
  </div>
  <!-- If no blog posts return message -->
  <div v-else class="blog-main">
    <p>No Posts published at this time.</p>
  </div>
</template>

<script>
export default {
  name: "blog-posts",
  data() {
    return {
      isOpen: 0,
      cardHeader: 'card-header',
      posts: [],
      dateOptions: { year: "numeric", month: "short", day: "2-digit" },
      linkResolver: this.$prismic.linkResolver
    };
  },
  methods: {
    getPosts() {
      //Query to get blog posts
      this.$prismic.client
        .query(this.$prismic.Predicates.at("document.type", "post"), {
          orderings: "[my.post.date]"
        })
        .then(response => {
          this.posts = response.results;
        });
    },
    //Function to get the first paragraph of text in a blog post and limit the displayed text at 300 characters
    getFirstParagraph(post) {
      const textLimit = 300;
      const slices = post.data.body;
      let firstParagraph = "";
      let haveFirstParagraph = false;

      slices.map(function(slice) {
        if (!haveFirstParagraph) {
          if (slice.slice_type == "text") {
            slice.primary.text.forEach(function(block) {
              if (block.type == "paragraph") {
                if (!haveFirstParagraph) {
                  firstParagraph += block.text;
                  haveFirstParagraph = true;
                }
              }
            });
          }
        }
      });

      const limitedText = firstParagraph.substr(0, textLimit);

      if (firstParagraph.length > textLimit) {
        return limitedText.substr(0, limitedText.lastIndexOf(" ")) + "...";
      } else {
        return firstParagraph;
      }
    }
  },
  created() {
    this.getPosts();
  }
};
</script>

<style scoped>

.blog-section {
  margin: 4em;
  color: #f4efe9;
}
.content {
  text-align: left;
}
.card-header-title {
  color: #f4efe9;
  text-transform: uppercase;
  font-weight: 500;
}
.card {
  background-color: transparent;
  border-radius: 0;
  -webkit-box-shadow: none;
  box-shadow: none;
  color: #f4efe9;
}
.card-header-post-number {
  padding: 0.75rem 1rem;
}
.card-header {
  box-shadow: none;
  border: 1px solid #f4efe9;
  margin: 6px 0;
  position: relative;
  z-index: 0;


}
.card-border{
  border: none !important;
}

</style>
