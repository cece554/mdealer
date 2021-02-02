<template>
  <!-- Vue conditional to check if there is any content in document -->
  <div v-if="hasContent" class="page">
    <div class="home">
      <!--nav-->
      <section id="nav">
        <b-navbar class="nav-wrap">
          <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
              <h1 class="title">
                {{ $prismic.richTextAsPlain(fields.headline) }}
              </h1>
            </b-navbar-item>
          </template>
          <template slot="end">
            <b-navbar-item href="#">
              Contact
            </b-navbar-item>
          </template>
        </b-navbar>
      </section>
      <!--intro-->
      <section id="intro" class="columns ">
        <div class="column is-three-fifths-desktop">
          <p class="blog-description has-text-left-tablet has-text-centered">
            {{ $prismic.richTextAsPlain(fields.description) }}
          </p>
        </div>

      </section>
      <!-- Button to edit document in dashboard -->
      <!--
      <prismic-edit-button :documentId="documentId"/>
      <div class="blog-avatar" :style="{ backgroundImage: 'url(' + fields.image + ')' }">
      </div>

      <h1 class="blog-title">
        {{ $prismic.richTextAsPlain(fields.headline) }}
      </h1>

      <p class="blog-description">{{ $prismic.richTextAsPlain(fields.description) }}</p> -->
    </div>
    <!-- Vue reference for blog posts component -->
    <div class="main-area">
      <div class="left-side">
        <div class="blog-section">
          <blog-posts />
        </div>
      </div>
      <div class="right-side is-hidden-touch">
        <div class="Space">
          <p class="space-text">Space to Breathe</p>
        </div>
      </div>
    </div>
  </div>
  <!-- If no content return message -->
  <div v-else class="home">
    <p>Please add some content to your blog home document.</p>
  </div>
</template>

<script>
import BlogPosts from "../components/BlogPosts.vue";

export default {
  name: "blog-home",
  components: {
    BlogPosts
  },
  data() {
    return {
      documentId: "",
      fields: {
        headline: null,
        description: null,
        image: null
      },
      posts: [],
      linkResolver: this.$prismic.linkResolver,
      hasContent: false
    };
  },
  methods: {
    getContent() {
      //Query to get home content
      this.$prismic.client.getSingle("blog_home").then(document => {
        if (document) {
          this.documentId = document.id;
          this.fields.headline = document.data.headline;
          this.fields.description = document.data.description;
          this.fields.image = document.data.image.url;

          //Check that the blog home contains content
          this.checkForContent();
        } else {
          //returns error page
          this.$router.push({ name: "not-found" });
        }
      });
    },
    //Function to check for any content on the blog home page
    checkForContent() {
      if (
        this.fields.image != undefined ||
        this.$prismic.richTextAsPlain(this.fields.headline) !== "" ||
        this.$prismic.richTextAsPlain(this.fields.description) !== ""
      ) {
        this.hasContent = true;
      }
    }
  },
  created() {
    this.getContent();
    window.prismic.setupEditButton();
  }
};
</script>

<style scoped lang="scss">
#nav {
  border-bottom: 1px solid #f4efe9;
  padding: 16px;

  h1 {
    color: #f4efe9;
  }
}

.title {
  font-family: 'Adieu';
  font-weight: 100;
  font-style: normal;
}
.navbar {
  background: #a74815 !important;
}
.navbar-end a {
  font-family: 'Roboto Mono' ;
  font-weight: 400 ;
  text-transform: uppercase;
  &:hover, &:active, &:focus{
    background: #a74815;
    text-decoration: underline;
  }

}

#intro {
  padding: 30px;
  border-bottom: 1px solid #f4efe9;
}
.level-left {
  max-width: 60vw;
  text-align: left;
}
.level {
  margin-bottom: 0 !important;
}
.main-area {
  display: flex;
}
.left-side {
  flex: 70%;
}

.blog-section {
  height: 100vh;
  max-height:100%;
  margin: 8em 6em 0 6em;
  color: #f4efe9;
}
.right-side {
  flex: 30%;
  border-left: 1px solid #f4efe9;
  display: flex;
  justify-content: center;
  padding-top: 30vh;
  margin-top: 12px;
}
.space-text{
    writing-mode: vertical-rl;
    text-orentation: mixed;
    text-transform: uppercase;
    font-family: "Roboto Mono"
}

@media only screen and (max-width: 768px){
  .blog-section {
  height: 100vh;
  max-height:100%;
  margin: 6em 2em 0 2em;
}
}
</style>
