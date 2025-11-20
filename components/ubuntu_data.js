
export const projects = [
  {
    "slug": "algopytest",
    "layout": "page",
    "title": "algopytest",
    "description": "A framework which hides away all of the complexity and repetitiveness that comes with testing Algorand Smart Contracts",
    "redirect": "https://github.com/DamianB-BitFlipper/algopytest",
    "badge": "<img alt=\"Total downloads for the project\" src=\"https://static.pepy.tech/badge/algopytest-framework\">",
    "importance": 1,
    "category": "personal",
    "content": ""
  },
  {
    "slug": "conda-comply",
    "layout": "page",
    "title": "conda-comply",
    "description": "Check conda environment dependencies for compliance with permissive, copyleft or other user-defined license sets",
    "//": null,
    "redirect": "https://github.com/Quantco/conda-comply",
    "importance": 1,
    "category": "work",
    "content": ""
  },
  {
    "slug": "groupstorm",
    "layout": "page",
    "title": "groupstorm",
    "description": "A hyper-fast library in Python to group candidate DataFrame rows against every row in a reference DataFrame according to user-supplied constraints",
    "//": null,
    "redirect": "https://github.com/Quantco/groupstorm",
    "importance": 2,
    "category": "work",
    "content": ""
  },
  {
    "slug": "guarda",
    "layout": "page",
    "title": "guarda-firewall",
    "description": "A proxy firewall prototype for RESTful services to easily support webauthn two-factor authentication",
    "redirect": "https://github.com/DamianB-BitFlipper/Guarda-firewall",
    "importance": 2,
    "category": "personal",
    "content": ""
  },
  {
    "slug": "mygpt",
    "layout": "page",
    "title": "MyGPT",
    "description": "An Android application which makes querying ChatGPT from mobile easy and seamless.",
    "redirect": "https://play.google.com/store/apps/details?id=com.intellitech.concepts.mobile_gpt",
    "//": null,
    "importance": 3,
    "category": "personal",
    "content": ""
  },
  {
    "slug": "js-os",
    "layout": "page",
    "title": "JS-OS",
    "description": "A unix-clone operating system that aims to be a learning tool for both the developer and the user.",
    "redirect": "https://github.com/DamianB-BitFlipper/JS-OS",
    "importance": 4,
    "category": "personal",
    "content": ""
  },
  {
    "slug": "slimcoin",
    "layout": "page",
    "title": "Slimcoin",
    "description": "The first cryptocurrency to implement Proof-of-Burn mining as its consensus mechanism. Its goal is to lower barriers for entry, while still maintaining a high level of security.",
    "//": null,
    "redirect": "https://github.com/slimcoin/slimcoin",
    "importance": 5,
    "category": "personal",
    "content": ""
  },
  {
    "slug": "raft",
    "layout": "page",
    "title": "Raft",
    "description": "A 6.824 class project to implement a fault-tolerant, distributed key/value store implementing the log-based Raft replicated state protocol.",
    "redirect": "http://nil.csail.mit.edu/6.824/2021/papers/raft-extended.pdf",
    "importance": 7,
    "category": "personal",
    "content": ""
  }
];
export const posts = [
  {
    "slug": "2023-07-04-jupyter-notebook",
    "date": "2023-07-04 08:57:00-0400",
    "layout": "post",
    "title": "a post with jupyter notebook",
    "description": "an example of a blog post with jupyter notebook",
    "categories": "sample-posts jupyter-notebook",
    "giscus_comments": true,
    "related_posts": false,
    "content": "\nTo include a jupyter notebook in a post, you can use the following code:\n\n{% raw %}\n\n```html\n{::nomarkdown}\n{% assign jupyter_path = \"assets/jupyter/blog.ipynb\" | relative_url %}\n{% capture notebook_exists %}{% file_exists assets/jupyter/blog.ipynb %}{% endcapture %}\n{% if notebook_exists == \"true\" %}\n    {% jupyter_notebook jupyter_path %}\n{% else %}\n    <p>Sorry, the notebook you are looking for does not exist.</p>\n{% endif %}\n{:/nomarkdown}\n```\n\n{% endraw %}\n\nLet's break it down: this is possible thanks to [Jekyll Jupyter Notebook plugin](https://github.com/red-data-tools/jekyll-jupyter-notebook) that allows you to embed jupyter notebooks in your posts. It basically calls [`jupyter nbconvert --to html`](https://nbconvert.readthedocs.io/en/latest/usage.html#convert-html) to convert the notebook to an html page and then includes it in the post. Since [Kramdown](https://jekyllrb.com/docs/configuration/markdown/) is the default Markdown renderer for Jekyll, we need to surround the call to the plugin with the [::nomarkdown](https://kramdown.gettalong.org/syntax.html#extensions) tag so that it stops processing this part with Kramdown and outputs the content as-is.\n\nThe plugin takes as input the path to the notebook, but it assumes the file exists. If you want to check if the file exists before calling the plugin, you can use the `file_exists` filter. This avoids getting a 404 error from the plugin and ending up displaying the main page inside of it instead. If the file does not exist, you can output a message to the user. The code displayed above outputs the following:\n\n{::nomarkdown}\n{% assign jupyter_path = \"assets/jupyter/blog.ipynb\" | relative_url %}\n{% capture notebook_exists %}{% file_exists assets/jupyter/blog.ipynb %}{% endcapture %}\n{% if notebook_exists == \"true\" %}\n    {% jupyter_notebook jupyter_path %}\n{% else %}\n    <p>Sorry, the notebook you are looking for does not exist.</p>\n{% endif %}\n{:/nomarkdown}\n\nNote that the jupyter notebook supports both light and dark themes.\n"
  },
  {
    "slug": "2023-05-12-custom-blockquotes",
    "date": "2023-05-12 15:53:00-0400",
    "layout": "post",
    "title": "a post with custom blockquotes",
    "description": "an example of a blog post with custom blockquotes",
    "categories": "sample-posts blockquotes",
    "giscus_comments": true,
    "related_posts": true,
    "content": "This post shows how to add custom styles for blockquotes. Based on [jekyll-gitbook](https://github.com/sighingnow/jekyll-gitbook) implementation.\n\nWe decided to support the same custom blockquotes as in [jekyll-gitbook](https://sighingnow.github.io/jekyll-gitbook/jekyll/2022-06-30-tips_warnings_dangers.html), which are also found in a lot of other sites' styles. The styles definitions can be found on the [_base.scss](https://github.com/alshedivat/al-folio/blob/master/_sass/_base.scss) file, more specifically:\n\n```scss\n/* Tips, warnings, and dangers */\n.post .post-content blockquote {\n    &.block-tip {\n    border-color: var(--global-tip-block);\n    background-color: var(--global-tip-block-bg);\n\n    p {\n      color: var(--global-tip-block-text);\n    }\n\n    h1, h2, h3, h4, h5, h6 {\n      color: var(--global-tip-block-title);\n    }\n  }\n\n  &.block-warning {\n    border-color: var(--global-warning-block);\n    background-color: var(--global-warning-block-bg);\n\n    p {\n      color: var(--global-warning-block-text);\n    }\n\n    h1, h2, h3, h4, h5, h6 {\n      color: var(--global-warning-block-title);\n    }\n  }\n\n  &.block-danger {\n    border-color: var(--global-danger-block);\n    background-color: var(--global-danger-block-bg);\n\n    p {\n      color: var(--global-danger-block-text);\n    }\n\n    h1, h2, h3, h4, h5, h6 {\n      color: var(--global-danger-block-title);\n    }\n  }\n}\n```\n\nA regular blockquote can be used as following:\n\n```markdown\n> This is a regular blockquote\n> and it can be used as usual\n```\n\n> This is a regular blockquote\n> and it can be used as usual\n\nThese custom styles can be used by adding the specific class to the blockquote, as follows:\n\n```markdown\n> ##### TIP\n>\n> A tip can be used when you want to give advice\n> related to a certain content.\n{: .block-tip }\n```\n\n> ##### TIP\n>\n> A tip can be used when you want to give advice\n> related to a certain content.\n{: .block-tip }\n\n```markdown\n> ##### WARNING\n>\n> This is a warning, and thus should\n> be used when you want to warn the user\n{: .block-warning }\n```\n\n> ##### WARNING\n>\n> This is a warning, and thus should\n> be used when you want to warn the user\n{: .block-warning }\n\n```markdown\n> ##### DANGER\n>\n> This is a danger zone, and thus should\n> be used carefully\n{: .block-danger }\n```\n\n> ##### DANGER\n>\n> This is a danger zone, and thus should\n> be used carefully\n{: .block-danger }\n"
  },
  {
    "slug": "2023-04-25-sidebar-table-of-contents",
    "date": "2023-04-25 10:14:00-0400",
    "layout": "post",
    "title": "a post with table of contents on a sidebar",
    "description": "an example of a blog post with table of contents on a sidebar",
    "categories": "sample-posts toc sidebar",
    "giscus_comments": true,
    "related_posts": false,
    "toc": {
      "sidebar": "left"
    },
    "content": "This post shows how to add a table of contents as a sidebar.\n\n## Adding a Table of Contents\n\nTo add a table of contents to a post as a sidebar, simply add\n```yml\ntoc:\n  sidebar: left\n```\nto the front matter of the post. The table of contents will be automatically generated from the headings in the post. If you wish to display the sidebar to the right, simply change `left` to `right`.\n\n### Example of Sub-Heading 1\n\nJean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch. Four loko meh 8-bit, tousled banh mi tilde forage Schlitz dreamcatcher twee 3 wolf moon. Chambray asymmetrical paleo salvia, sartorial umami four loko master cleanse drinking vinegar brunch. <a href=\"https://www.pinterest.com\">Pinterest</a> DIY authentic Schlitz, hoodie Intelligentsia butcher trust fund brunch shabby chic Kickstarter forage flexitarian. Direct trade <a href=\"https://en.wikipedia.org/wiki/Cold-pressed_juice\">cold-pressed</a> meggings stumptown plaid, pop-up taxidermy. Hoodie XOXO fingerstache scenester Echo Park. Plaid ugh Wes Anderson, freegan pug selvage fanny pack leggings pickled food truck DIY irony Banksy.\n\n### Example of another Sub-Heading 1\n\nJean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch. Four loko meh 8-bit, tousled banh mi tilde forage Schlitz dreamcatcher twee 3 wolf moon. Chambray asymmetrical paleo salvia, sartorial umami four loko master cleanse drinking vinegar brunch. <a href=\"https://www.pinterest.com\">Pinterest</a> DIY authentic Schlitz, hoodie Intelligentsia butcher trust fund brunch shabby chic Kickstarter forage flexitarian. Direct trade <a href=\"https://en.wikipedia.org/wiki/Cold-pressed_juice\">cold-pressed</a> meggings stumptown plaid, pop-up taxidermy. Hoodie XOXO fingerstache scenester Echo Park. Plaid ugh Wes Anderson, freegan pug selvage fanny pack leggings pickled food truck DIY irony Banksy.\n\n## Customizing Your Table of Contents\n{:data-toc-text=\"Customizing\"}\n\nIf you want to learn more about how to customize the table of contents of your sidebar, you can check the [bootstrap-toc](https://afeld.github.io/bootstrap-toc/) documentation. Notice that you can even customize the text of the heading that will be displayed on the sidebar.\n\n### Example of Sub-Heading 2\n\nJean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch. Four loko meh 8-bit, tousled banh mi tilde forage Schlitz dreamcatcher twee 3 wolf moon. Chambray asymmetrical paleo salvia, sartorial umami four loko master cleanse drinking vinegar brunch. <a href=\"https://www.pinterest.com\">Pinterest</a> DIY authentic Schlitz, hoodie Intelligentsia butcher trust fund brunch shabby chic Kickstarter forage flexitarian. Direct trade <a href=\"https://en.wikipedia.org/wiki/Cold-pressed_juice\">cold-pressed</a> meggings stumptown plaid, pop-up taxidermy. Hoodie XOXO fingerstache scenester Echo Park. Plaid ugh Wes Anderson, freegan pug selvage fanny pack leggings pickled food truck DIY irony Banksy.\n\n### Example of another Sub-Heading 2\n\nJean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch. Four loko meh 8-bit, tousled banh mi tilde forage Schlitz dreamcatcher twee 3 wolf moon. Chambray asymmetrical paleo salvia, sartorial umami four loko master cleanse drinking vinegar brunch. <a href=\"https://www.pinterest.com\">Pinterest</a> DIY authentic Schlitz, hoodie Intelligentsia butcher trust fund brunch shabby chic Kickstarter forage flexitarian. Direct trade <a href=\"https://en.wikipedia.org/wiki/Cold-pressed_juice\">cold-pressed</a> meggings stumptown plaid, pop-up taxidermy. Hoodie XOXO fingerstache scenester Echo Park. Plaid ugh Wes Anderson, freegan pug selvage fanny pack leggings pickled food truck DIY irony Banksy.\n"
  },
  {
    "slug": "2023-04-25-audios",
    "date": "2023-04-25T10:25:00.000Z",
    "layout": "post",
    "title": "a post with audios",
    "description": "this is what included audios could look like",
    "tags": "including audios",
    "categories": "sample-posts",
    "content": "This is an example post with audios. It supports local audio files.\n\n<div class=\"row mt-3\">\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include audio.html path=\"assets/audio/epicaly-short-113909.mp3\" controls=true %}\n    </div>\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include audio.html path=\"https://cdn.pixabay.com/download/audio/2022/06/25/audio_69a61cd6d6.mp3\" controls=true %}\n    </div>\n</div>\n<div class=\"caption\">\n    A simple, elegant caption looks good between video rows, after each row, or doesn't have to be there at all.\n</div>\n"
  },
  {
    "slug": "2023-04-24-videos",
    "date": "2023-04-24T21:01:00.000Z",
    "layout": "post",
    "title": "a post with videos",
    "description": "this is what included videos could look like",
    "tags": "including videos",
    "categories": "sample-posts",
    "content": "This is an example post with videos. It supports local video files.\n\n<div class=\"row mt-3\">\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include video.html path=\"assets/video/pexels-engin-akyurt-6069112-960x540-30fps.mp4\" class=\"img-fluid rounded z-depth-1\" controls=true autoplay=true %}\n    </div>\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include video.html path=\"assets/video/pexels-engin-akyurt-6069112-960x540-30fps.mp4\" class=\"img-fluid rounded z-depth-1\" controls=true %}\n    </div>\n</div>\n<div class=\"caption\">\n    A simple, elegant caption looks good between video rows, after each row, or doesn't have to be there at all.\n</div>\n\nIt does also support embedding videos from different sources. Here are some examples:\n\n<div class=\"row mt-3\">\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include video.html path=\"https://www.youtube.com/embed/jNQXAC9IVRw\" class=\"img-fluid rounded z-depth-1\" %}\n    </div>\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include video.html path=\"https://player.vimeo.com/video/524933864?h=1ac4fd9fb4&title=0&byline=0&portrait=0\" class=\"img-fluid rounded z-depth-1\" %}\n    </div>\n</div>"
  },
  {
    "slug": "2023-03-21-tables",
    "date": "2023-03-20 14:37:00-0400",
    "layout": "post",
    "title": "displaying beautiful tables with Bootstrap Tables",
    "description": "an example of how to use Bootstrap Tables",
    "categories": "sample-posts",
    "giscus_comments": true,
    "related_posts": true,
    "datatable": true,
    "content": "\nUsing markdown to display tables is easy. Just use the following syntax:\n\n```markdown\n| Left aligned | Center aligned | Right aligned |\n| :----------- | :------------: | ------------: |\n| Left 1       | center 1       | right 1       |\n| Left 2       | center 2       | right 2       |\n| Left 3       | center 3       | right 3       |\n```\n\nThat will generate:\n\n| Left aligned | Center aligned | Right aligned |\n| :----------- | :------------: | ------------: |\n| Left 1       | center 1       | right 1       |\n| Left 2       | center 2       | right 2       |\n| Left 3       | center 3       | right 3       |\n\n<p></p>\n\nIt is also possible to use HTML to display tables. For example, the following HTML code will display a table with [Bootstrap Table](https://bootstrap-table.com/), loaded from a JSON file:\n\n{% raw  %}\n```html\n<table\n  id=\"table\"\n  data-toggle=\"table\"\n  data-url=\"{{ '/assets/json/table_data.json' | relative_url }}\">\n  <thead>\n    <tr>\n      <th data-field=\"id\">ID</th>\n      <th data-field=\"name\">Item Name</th>\n      <th data-field=\"price\">Item Price</th>\n    </tr>\n  </thead>\n</table>\n```\n{% endraw  %}\n\n<table\n  data-toggle=\"table\"\n  data-url=\"{{ '/assets/json/table_data.json' | relative_url }}\">\n  <thead>\n    <tr>\n      <th data-field=\"id\">ID</th>\n      <th data-field=\"name\">Item Name</th>\n      <th data-field=\"price\">Item Price</th>\n    </tr>\n  </thead>\n</table>\n\n<p></p>\n\nBy using [Bootstrap Table](https://bootstrap-table.com/) it is possible to create pretty complex tables, with pagination, search, and more. For example, the following HTML code will display a table, loaded from a JSON file, with pagination, search, checkboxes, and header/content alignment. For more information, check the [documentation](https://examples.bootstrap-table.com/index.html).\n\n{% raw  %}\n```html\n<table\n  data-click-to-select=\"true\"\n  data-height=\"460\"\n  data-pagination=\"true\"\n  data-search=\"true\"\n  data-toggle=\"table\"\n  data-url=\"{{ '/assets/json/table_data.json' | relative_url }}\">\n  <thead>\n    <tr>\n      <th data-checkbox=\"true\"></th>\n      <th data-field=\"id\" data-halign=\"left\" data-align=\"center\" data-sortable=\"true\">ID</th>\n      <th data-field=\"name\" data-halign=\"center\" data-align=\"right\" data-sortable=\"true\">Item Name</th>\n      <th data-field=\"price\" data-halign=\"right\" data-align=\"left\" data-sortable=\"true\">Item Price</th>\n    </tr>\n  </thead>\n</table>\n```\n{% endraw  %}\n\n<table\n  data-click-to-select=\"true\"\n  data-height=\"460\"\n  data-pagination=\"true\"\n  data-search=\"true\"\n  data-toggle=\"table\"\n  data-url=\"{{ '/assets/json/table_data.json' | relative_url }}\">\n  <thead>\n    <tr>\n      <th data-checkbox=\"true\"></th>\n      <th data-field=\"id\" data-halign=\"left\" data-align=\"center\" data-sortable=\"true\">ID</th>\n      <th data-field=\"name\" data-halign=\"center\" data-align=\"right\" data-sortable=\"true\">Item Name</th>\n      <th data-field=\"price\" data-halign=\"right\" data-align=\"left\" data-sortable=\"true\">Item Price</th>\n    </tr>\n  </thead>\n</table>\n"
  },
  {
    "slug": "2023-03-20-table-of-contents",
    "date": "2023-03-20 11:59:00-0400",
    "layout": "post",
    "title": "a post with table of contents",
    "description": "an example of a blog post with table of contents",
    "categories": "sample-posts toc",
    "giscus_comments": true,
    "related_posts": false,
    "toc": {
      "beginning": true
    },
    "content": "This post shows how to add a table of contents in the beginning of the post.\n\n## Adding a Table of Contents\n\nTo add a table of contents to a post, simply add\n```yml\ntoc:\n  beginning: true\n```\nto the front matter of the post. The table of contents will be automatically generated from the headings in the post.\n\n### Example of Sub-Heading 1\n\nJean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch. Four loko meh 8-bit, tousled banh mi tilde forage Schlitz dreamcatcher twee 3 wolf moon. Chambray asymmetrical paleo salvia, sartorial umami four loko master cleanse drinking vinegar brunch. <a href=\"https://www.pinterest.com\">Pinterest</a> DIY authentic Schlitz, hoodie Intelligentsia butcher trust fund brunch shabby chic Kickstarter forage flexitarian. Direct trade <a href=\"https://en.wikipedia.org/wiki/Cold-pressed_juice\">cold-pressed</a> meggings stumptown plaid, pop-up taxidermy. Hoodie XOXO fingerstache scenester Echo Park. Plaid ugh Wes Anderson, freegan pug selvage fanny pack leggings pickled food truck DIY irony Banksy.\n\n### Example of another Sub-Heading 1\n\nJean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch. Four loko meh 8-bit, tousled banh mi tilde forage Schlitz dreamcatcher twee 3 wolf moon. Chambray asymmetrical paleo salvia, sartorial umami four loko master cleanse drinking vinegar brunch. <a href=\"https://www.pinterest.com\">Pinterest</a> DIY authentic Schlitz, hoodie Intelligentsia butcher trust fund brunch shabby chic Kickstarter forage flexitarian. Direct trade <a href=\"https://en.wikipedia.org/wiki/Cold-pressed_juice\">cold-pressed</a> meggings stumptown plaid, pop-up taxidermy. Hoodie XOXO fingerstache scenester Echo Park. Plaid ugh Wes Anderson, freegan pug selvage fanny pack leggings pickled food truck DIY irony Banksy.\n\n## Table of Contents Options\n\nIf you want to learn more about how to customize the table of contents, you can check the [jekyll-toc](https://github.com/toshimaru/jekyll-toc) repository.\n\n### Example of Sub-Heading 2\n\nJean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch. Four loko meh 8-bit, tousled banh mi tilde forage Schlitz dreamcatcher twee 3 wolf moon. Chambray asymmetrical paleo salvia, sartorial umami four loko master cleanse drinking vinegar brunch. <a href=\"https://www.pinterest.com\">Pinterest</a> DIY authentic Schlitz, hoodie Intelligentsia butcher trust fund brunch shabby chic Kickstarter forage flexitarian. Direct trade <a href=\"https://en.wikipedia.org/wiki/Cold-pressed_juice\">cold-pressed</a> meggings stumptown plaid, pop-up taxidermy. Hoodie XOXO fingerstache scenester Echo Park. Plaid ugh Wes Anderson, freegan pug selvage fanny pack leggings pickled food truck DIY irony Banksy.\n\n### Example of another Sub-Heading 2\n\nJean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch. Four loko meh 8-bit, tousled banh mi tilde forage Schlitz dreamcatcher twee 3 wolf moon. Chambray asymmetrical paleo salvia, sartorial umami four loko master cleanse drinking vinegar brunch. <a href=\"https://www.pinterest.com\">Pinterest</a> DIY authentic Schlitz, hoodie Intelligentsia butcher trust fund brunch shabby chic Kickstarter forage flexitarian. Direct trade <a href=\"https://en.wikipedia.org/wiki/Cold-pressed_juice\">cold-pressed</a> meggings stumptown plaid, pop-up taxidermy. Hoodie XOXO fingerstache scenester Echo Park. Plaid ugh Wes Anderson, freegan pug selvage fanny pack leggings pickled food truck DIY irony Banksy.\n"
  },
  {
    "slug": "2022-12-10-giscus-comments",
    "date": "2022-12-10 11:59:00-0400",
    "layout": "post",
    "title": "a post with giscus comments",
    "description": "an example of a blog post with giscus comments",
    "categories": "sample-posts external-services",
    "giscus_comments": true,
    "related_posts": false,
    "content": "This post shows how to add GISCUS comments.\n"
  },
  {
    "slug": "2022-02-01-redirect",
    "date": "2022-02-01T17:39:00.000Z",
    "layout": "post",
    "title": "a post with redirect",
    "description": "you can also redirect to assets like pdf",
    "redirect": "/assets/pdf/example_pdf.pdf",
    "content": "\nRedirecting to another page.\n"
  },
  {
    "slug": "2021-07-04-diagrams",
    "date": "2021-07-04T17:39:00.000Z",
    "layout": "post",
    "title": "a post with diagrams",
    "description": "an example of a blog post with diagrams",
    "content": "\nThis theme supports generating various diagrams from a text description using [jekyll-diagrams](https://github.com/zhustec/jekyll-diagrams){:target=\"\\_blank\"} plugin.\nBelow, we generate a few examples of such diagrams using languages such as [mermaid](https://mermaid-js.github.io/mermaid/){:target=\"\\_blank\"}, [plantuml](https://plantuml.com/){:target=\"\\_blank\"}, [vega-lite](https://vega.github.io/vega-lite/){:target=\"\\_blank\"}, etc.\n\n**Note:** different diagram-generation packages require external dependencies to be installed on your machine.\nAlso, be mindful of that because of diagram generation the fist time you build your Jekyll website after adding new diagrams will be SLOW.\nFor any other details, please refer to [jekyll-diagrams](https://github.com/zhustec/jekyll-diagrams){:target=\"\\_blank\"} README.\n\n\n## Mermaid\n\nInstall mermaid using `node.js` package manager `npm` by running the following command:\n```bash\nnpm install -g mermaid.cli\n```\n\nThe diagram below was generated by the following code:\n\n{% raw %}\n```\n{% mermaid %}\nsequenceDiagram\n    participant John\n    participant Alice\n    Alice->>John: Hello John, how are you?\n    John-->>Alice: Great!\n{% endmermaid %}\n```\n{% endraw %}\n\n{% mermaid %}\nsequenceDiagram\n    participant John\n    participant Alice\n    Alice->>John: Hello John, how are you?\n    John-->>Alice: Great!\n{% endmermaid %}\n"
  },
  {
    "slug": "2018-12-22-distill",
    "date": "2021-05-22T00:00:00.000Z",
    "layout": "distill",
    "title": "a distill-style blog post",
    "description": "an example of a distill-style blog post and main elements",
    "giscus_comments": true,
    "featured": true,
    "authors": [
      {
        "name": "Albert Einstein",
        "url": "https://en.wikipedia.org/wiki/Albert_Einstein",
        "affiliations": {
          "name": "IAS, Princeton"
        }
      },
      {
        "name": "Boris Podolsky",
        "url": "https://en.wikipedia.org/wiki/Boris_Podolsky",
        "affiliations": {
          "name": "IAS, Princeton"
        }
      },
      {
        "name": "Nathan Rosen",
        "url": "https://en.wikipedia.org/wiki/Nathan_Rosen",
        "affiliations": {
          "name": "IAS, Princeton"
        }
      }
    ],
    "bibliography": "2018-12-22-distill.bib",
    "toc": [
      {
        "name": "Equations"
      },
      {
        "name": "Citations"
      },
      {
        "name": "Footnotes"
      },
      {
        "name": "Code Blocks"
      },
      {
        "name": "Interactive Plots"
      },
      {
        "name": "Layouts"
      },
      {
        "name": "Other Typography?"
      }
    ],
    "_styles": ".fake-img {\n  background: #bbb;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);\n  margin-bottom: 12px;\n} .fake-img p {\n  font-family: monospace;\n  color: white;\n  text-align: left;\n  margin: 12px 0;\n  text-align: center;\n  font-size: 16px;\n}\n",
    "content": "\n## Equations\n\nThis theme supports rendering beautiful math in inline and display modes using [MathJax 3](https://www.mathjax.org/) engine.\nYou just need to surround your math expression with `$$`, like `$$ E = mc^2 $$`.\nIf you leave it inside a paragraph, it will produce an inline expression, just like $$ E = mc^2 $$.\n\nTo use display mode, again surround your expression with `$$` and place it as a separate paragraph.\nHere is an example:\n\n$$\n\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)\n$$\n\nNote that MathJax 3 is [a major re-write of MathJax](https://docs.mathjax.org/en/latest/upgrading/whats-new-3.0.html) that brought a significant improvement to the loading and rendering speed, which is now [on par with KaTeX](http://www.intmath.com/cg5/katex-mathjax-comparison.php).\n\n***\n\n## Citations\n\nCitations are then used in the article body with the `<d-cite>` tag.\nThe key attribute is a reference to the id provided in the bibliography.\nThe key attribute can take multiple ids, separated by commas.\n\nThe citation is presented inline like this: <d-cite key=\"gregor2015draw\"></d-cite> (a number that displays more information on hover).\nIf you have an appendix, a bibliography is automatically created and populated in it.\n\nDistill chose a numerical inline citation style to improve readability of citation dense articles and because many of the benefits of longer citations are obviated by displaying more information on hover.\nHowever, we consider it good style to mention author last names if you discuss something at length and it fits into the flow well — the authors are human and it’s nice for them to have the community associate them with their work.\n\n***\n\n## Footnotes\n\nJust wrap the text you would like to show up in a footnote in a `<d-footnote>` tag.\nThe number of the footnote will be automatically generated.<d-footnote>This will become a hoverable footnote.</d-footnote>\n\n***\n\n## Code Blocks\n\nSyntax highlighting is provided within `<d-code>` tags.\nAn example of inline code snippets: `<d-code language=\"html\">let x = 10;</d-code>`.\nFor larger blocks of code, add a `block` attribute:\n\n<d-code block language=\"javascript\">\n  var x = 25;\n  function(x) {\n    return x * x;\n  }\n</d-code>\n\n**Note:** `<d-code>` blocks do not look good in the dark mode.\nYou can always use the default code-highlight using the `highlight` liquid tag:\n\n{% highlight javascript %}\nvar x = 25;\nfunction(x) {\n  return x * x;\n}\n{% endhighlight %}\n\n***\n\n## Interactive Plots\n\nYou can add interactive plots using plotly + iframes :framed_picture:\n\n<div class=\"l-page\">\n  <iframe src=\"{{ '/assets/plotly/demo.html' | relative_url }}\" frameborder='0' scrolling='no' height=\"500px\" width=\"100%\" style=\"border: 1px dashed grey;\"></iframe>\n</div>\n\nThe plot must be generated separately and saved into an HTML file.\nTo generate the plot that you see above, you can use the following code snippet:\n\n{% highlight python %}\nimport pandas as pd\nimport plotly.express as px\ndf = pd.read_csv(\n  'https://raw.githubusercontent.com/plotly/datasets/master/earthquakes-23k.csv'\n)\nfig = px.density_mapbox(\n  df,\n  lat='Latitude',\n  lon='Longitude',\n  z='Magnitude',\n  radius=10,\n  center=dict(lat=0, lon=180),\n  zoom=0,\n  mapbox_style=\"stamen-terrain\",\n)\nfig.show()\nfig.write_html('assets/plotly/demo.html')\n{% endhighlight %}\n\n***\n\n## Details boxes\n\nDetails boxes are collapsible boxes which hide additional information from the user. They can be added with the `details` liquid tag:\n\n{% details Click here to know more %}\nAdditional details, where math $$ 2x - 1 $$ and `code` is rendered correctly.\n{% enddetails %}\n\n***\n\n## Layouts\n\nThe main text column is referred to as the body.\nIt is the assumed layout of any direct descendants of the `d-article` element.\n\n<div class=\"fake-img l-body\">\n  <p>.l-body</p>\n</div>\n\nFor images you want to display a little larger, try `.l-page`:\n\n<div class=\"fake-img l-page\">\n  <p>.l-page</p>\n</div>\n\nAll of these have an outset variant if you want to poke out from the body text a little bit.\nFor instance:\n\n<div class=\"fake-img l-body-outset\">\n  <p>.l-body-outset</p>\n</div>\n\n<div class=\"fake-img l-page-outset\">\n  <p>.l-page-outset</p>\n</div>\n\nOccasionally you’ll want to use the full browser width.\nFor this, use `.l-screen`.\nYou can also inset the element a little from the edge of the browser by using the inset variant.\n\n<div class=\"fake-img l-screen\">\n  <p>.l-screen</p>\n</div>\n<div class=\"fake-img l-screen-inset\">\n  <p>.l-screen-inset</p>\n</div>\n\nThe final layout is for marginalia, asides, and footnotes.\nIt does not interrupt the normal flow of `.l-body` sized text except on mobile screen sizes.\n\n<div class=\"fake-img l-gutter\">\n  <p>.l-gutter</p>\n</div>\n\n***\n\n## Other Typography?\n\nEmphasis, aka italics, with *asterisks* (`*asterisks*`) or _underscores_ (`_underscores_`).\n\nStrong emphasis, aka bold, with **asterisks** or __underscores__.\n\nCombined emphasis with **asterisks and _underscores_**.\n\nStrikethrough uses two tildes. ~~Scratch this.~~\n\n1. First ordered list item\n2. Another item\n⋅⋅* Unordered sub-list.\n1. Actual numbers don't matter, just that it's a number\n⋅⋅1. Ordered sub-list\n4. And another item.\n\n⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).\n\n⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅\n⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅\n⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)\n\n* Unordered list can use asterisks\n- Or minuses\n+ Or pluses\n\n[I'm an inline-style link](https://www.google.com)\n\n[I'm an inline-style link with title](https://www.google.com \"Google's Homepage\")\n\n[I'm a reference-style link][Arbitrary case-insensitive reference text]\n\n[I'm a relative reference to a repository file](../blob/master/LICENSE)\n\n[You can use numbers for reference-style link definitions][1]\n\nOr leave it empty and use the [link text itself].\n\nURLs and URLs in angle brackets will automatically get turned into links.\nhttp://www.example.com or <http://www.example.com> and sometimes\nexample.com (but not on Github, for example).\n\nSome text to show that the reference links can follow later.\n\n[arbitrary case-insensitive reference text]: https://www.mozilla.org\n[1]: http://slashdot.org\n[link text itself]: http://www.reddit.com\n\nHere's our logo (hover to see the title text):\n\nInline-style:\n![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png \"Logo Title Text 1\")\n\nReference-style:\n![alt text][logo]\n\n[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png \"Logo Title Text 2\"\n\nInline `code` has `back-ticks around` it.\n\n```javascript\nvar s = \"JavaScript syntax highlighting\";\nalert(s);\n```\n\n```python\ns = \"Python syntax highlighting\"\nprint s\n```\n\n```\nNo language indicated, so no syntax highlighting.\nBut let's throw in a <b>tag</b>.\n```\n\nColons can be used to align columns.\n\n| Tables        | Are           | Cool  |\n| ------------- |:-------------:| -----:|\n| col 3 is      | right-aligned | $1600 |\n| col 2 is      | centered      |   $12 |\n| zebra stripes | are neat      |    $1 |\n\nThere must be at least 3 dashes separating each header cell.\nThe outer pipes (|) are optional, and you don't need to make the\nraw Markdown line up prettily. You can also use inline Markdown.\n\nMarkdown | Less | Pretty\n--- | --- | ---\n*Still* | `renders` | **nicely**\n1 | 2 | 3\n\n> Blockquotes are very handy in email to emulate reply text.\n> This line is part of the same quote.\n\nQuote break.\n\n> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.\n\n\nHere's a line for us to start with.\n\nThis line is separated from the one above by two newlines, so it will be a *separate paragraph*.\n\nThis line is also a separate paragraph, but...\nThis line is only separated by a single newline, so it's a separate line in the *same paragraph*.\n"
  },
  {
    "slug": "2020-09-28-github-metadata",
    "date": "2020-09-28T21:01:00.000Z",
    "layout": "post",
    "title": "a post with github metadata",
    "description": "a quick run down on accessing github metadata.",
    "categories": "sample-posts external-services",
    "content": "\r\nA sample blog page that demonstrates the accessing of github meta data.\r\n\r\n## What does Github-MetaData do?\r\n* Propagates the site.github namespace with repository metadata\r\n* Setting site variables :\r\n  * site.title\r\n  * site.description\r\n  * site.url\r\n  * site.baseurl\r\n* Accessing the metadata - duh.\r\n* Generating edittable links.\r\n\r\n## Additional Reading\r\n* If you're receiving incorrect/missing data, you may need to perform a Github API<a href=\"https://github.com/jekyll/github-metadata/blob/master/docs/authentication.md\"> authentication</a>.\r\n* Go through this <a href=\"https://jekyll.github.io/github-metadata/\">README</a> for more details on the topic.\r\n* <a href= \"https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md\">This page</a> highlights all the feilds you can access with github-metadata.\r\n<br />\r\n\r\n## Example MetaData\r\n* Host Name : {{ site.github.hostname }}\r\n* URL : {{ site.github.url }}\r\n* BaseURL : {{ site.github.baseurl }}\r\n* Archived : {{ site.github.archived}}\r\n* Contributors :\r\n{% for contributor in site.github.contributors %}\r\n  * {{ contributor.login }}\r\n{% endfor %}\r\n"
  },
  {
    "slug": "2020-09-28-twitter",
    "date": "2020-09-28 11:12:00-0400",
    "layout": "post",
    "title": "a post with twitter",
    "description": "an example of a blog post with twitter",
    "tags": "formatting",
    "categories": "sample-posts external-services",
    "content": "A sample blog page that demonstrates the inclusion of Tweets/Timelines/etc.\r\n\r\n# Tweet\r\nAn example of displaying a tweet:\r\n{% twitter https://twitter.com/rubygems/status/518821243320287232 %}\r\n\r\n# Timeline\r\nAn example of pulling from a timeline:\r\n{% twitter https://twitter.com/jekyllrb maxwidth=500 limit=3 %}\r\n\r\n# Additional Details\r\nFor more details on using the plugin visit: [jekyll-twitter-plugin](https://github.com/rob-murray/jekyll-twitter-plugin)\r\n"
  },
  {
    "slug": "2015-10-20-disqus-comments",
    "date": "2015-10-20 11:59:00-0400",
    "layout": "post",
    "title": "a post with disqus comments",
    "description": "an example of a blog post with disqus comments",
    "categories": "sample-posts external-services",
    "disqus_comments": true,
    "related_posts": false,
    "content": "This post shows how to add DISQUS comments.\n"
  },
  {
    "slug": "2015-10-20-math",
    "date": "2015-10-20 11:12:00-0400",
    "layout": "post",
    "title": "a post with math",
    "description": "an example of a blog post with some math",
    "tags": "formatting math",
    "categories": "sample-posts",
    "related_posts": false,
    "content": "This theme supports rendering beautiful math in inline and display modes using [MathJax 3](https://www.mathjax.org/) engine. You just need to surround your math expression with `$$`, like `$$ E = mc^2 $$`. If you leave it inside a paragraph, it will produce an inline expression, just like $$ E = mc^2 $$.\n\nTo use display mode, again surround your expression with `$$` and place it as a separate paragraph. Here is an example:\n\n$$\n\\sum_{k=1}^\\infty |\\langle x, e_k \\rangle|^2 \\leq \\|x\\|^2\n$$\n\nYou can also use `\\begin{equation}...\\end{equation}` instead of `$$` for display mode math.\nMathJax will automatically number equations:\n\n\\begin{equation}\n\\label{eq:cauchy-schwarz}\n\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)\n\\end{equation}\n\nand by adding `\\label{...}` inside the equation environment, we can now refer to the equation using `\\eqref`.\n\nNote that MathJax 3 is [a major re-write of MathJax](https://docs.mathjax.org/en/latest/upgrading/whats-new-3.0.html) that brought a significant improvement to the loading and rendering speed, which is now [on par with KaTeX](http://www.intmath.com/cg5/katex-mathjax-comparison.php).\n"
  },
  {
    "slug": "2015-07-15-code",
    "date": "2015-07-15T15:09:00.000Z",
    "layout": "post",
    "title": "a post with code",
    "description": "an example of a blog post with some code",
    "tags": "formatting code",
    "categories": "sample-posts",
    "featured": true,
    "content": "This theme implements a built-in Jekyll feature, the use of Rouge, for syntax highlighting.\nIt supports more than 100 languages.\nThis example is in C++.\nAll you have to do is wrap your code in markdown code tags:\n\n````markdown\n```c++\ncode code code\n```\n````\n\n```c++\nint main(int argc, char const \\*argv[])\n{\n    string myString;\n\n    cout << \"input a string: \";\n    getline(cin, myString);\n    int length = myString.length();\n\n    char charArray = new char * [length];\n\n    charArray = myString;\n    for(int i = 0; i < length; ++i){\n        cout << charArray[i] << \" \";\n    }\n\n    return 0;\n}\n```\n\nFor displaying code in a list item, you have to be aware of the indentation, as stated in this [Stackoverflow answer](https://stackoverflow.com/questions/34987908/embed-a-code-block-in-a-list-item-with-proper-indentation-in-kramdown/38090598#38090598). You must indent your code by **(3 * bullet_indent_level)** spaces. This is because kramdown (the markdown engine used by Jekyll) indentation for the code block in lists is determined by the column number of the first non-space character after the list item marker. For example:\n\n```markdown\n1. We can put fenced code blocks inside nested bullets, too.\n   1. Like this:\n      ```c\n      printf(\"Hello, World!\");\n      ```\n\n   2. The key is to indent your fenced block in the same line as the first character of the line.\n```\n\nWhich displays:\n\n1. We can put fenced code blocks inside nested bullets, too.\n   1. Like this:\n      ```c\n      printf(\"Hello, World!\");\n      ```\n\n   2. The key is to indent your fenced block in the same line as the first character of the line.\n\nBy default, it does not display line numbers. If you want to display line numbers for every code block, you can set `kramdown.syntax_highlighter_opts.block.line_numbers` to true in your `_config.yml` file.\n\nIf you want to display line numbers for a specific code block, all you have to do is wrap your code in a liquid tag:\n\n{% raw %}\n{% highlight c++ linenos %}  <br/> code code code <br/> {% endhighlight %}\n{% endraw %}\n\nThe keyword `linenos` triggers display of line numbers.\nProduces something like this:\n\n{% highlight c++ linenos %}\n\nint main(int argc, char const \\*argv[])\n{\n    string myString;\n\n    cout << \"input a string: \";\n    getline(cin, myString);\n    int length = myString.length();\n\n    char charArray = new char * [length];\n\n    charArray = myString;\n    for(int i = 0; i < length; ++i){\n        cout << charArray[i] << \" \";\n    }\n\n    return 0;\n}\n\n{% endhighlight %}\n"
  },
  {
    "slug": "2015-05-15-images",
    "date": "2015-05-15T21:01:00.000Z",
    "layout": "post",
    "title": "a post with images",
    "description": "this is what included images could look like",
    "tags": "formatting images",
    "categories": "sample-posts",
    "thumbnail": "assets/img/9.jpg",
    "content": "This is an example post with image galleries.\n\n<div class=\"row mt-3\">\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include figure.html path=\"assets/img/9.jpg\" class=\"img-fluid rounded z-depth-1\" %}\n    </div>\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include figure.html path=\"assets/img/7.jpg\" class=\"img-fluid rounded z-depth-1\" %}\n    </div>\n</div>\n<div class=\"caption\">\n    A simple, elegant caption looks good between image rows, after each row, or doesn't have to be there at all.\n</div>\n\nImages can be made zoomable.\nSimply add `data-zoomable` to `<img>` tags that you want to make zoomable.\n\n<div class=\"row mt-3\">\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include figure.html path=\"assets/img/8.jpg\" class=\"img-fluid rounded z-depth-1\" zoomable=true %}\n    </div>\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include figure.html path=\"assets/img/10.jpg\" class=\"img-fluid rounded z-depth-1\" zoomable=true %}\n    </div>\n</div>\n\nThe rest of the images in this post are all zoomable, arranged into different mini-galleries.\n\n<div class=\"row mt-3\">\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include figure.html path=\"assets/img/11.jpg\" class=\"img-fluid rounded z-depth-1\" zoomable=true %}\n    </div>\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include figure.html path=\"assets/img/12.jpg\" class=\"img-fluid rounded z-depth-1\" zoomable=true %}\n    </div>\n    <div class=\"col-sm mt-3 mt-md-0\">\n        {% include figure.html path=\"assets/img/7.jpg\" class=\"img-fluid rounded z-depth-1\" zoomable=true %}\n    </div>\n</div>\n"
  },
  {
    "slug": "2015-03-15-formatting-and-links",
    "date": "2015-03-15T16:40:16.000Z",
    "layout": "post",
    "title": "a post with formatting and links",
    "description": "march & april, looking forward to summer",
    "tags": "formatting links",
    "categories": "sample-posts",
    "content": "Jean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch. Four loko meh 8-bit, tousled banh mi tilde forage Schlitz dreamcatcher twee 3 wolf moon. Chambray asymmetrical paleo salvia, sartorial umami four loko master cleanse drinking vinegar brunch. <a href=\"https://www.pinterest.com\">Pinterest</a> DIY authentic Schlitz, hoodie Intelligentsia butcher trust fund brunch shabby chic Kickstarter forage flexitarian. Direct trade <a href=\"https://en.wikipedia.org/wiki/Cold-pressed_juice\">cold-pressed</a> meggings stumptown plaid, pop-up taxidermy. Hoodie XOXO fingerstache scenester Echo Park. Plaid ugh Wes Anderson, freegan pug selvage fanny pack leggings pickled food truck DIY irony Banksy.\n\n#### Hipster list\n<ul>\n    <li>brunch</li>\n    <li>fixie</li>\n    <li>raybans</li>\n    <li>messenger bag</li>\n</ul>\n\nHoodie Thundercats retro, tote bag 8-bit Godard craft beer gastropub. Truffaut Tumblr taxidermy, raw denim Kickstarter sartorial dreamcatcher. Quinoa chambray slow-carb salvia readymade, bicycle rights 90's yr typewriter selfies letterpress cardigan vegan.\n\n<hr>\n\nPug heirloom High Life vinyl swag, single-origin coffee four dollar toast taxidermy reprehenderit fap distillery master cleanse locavore. Est anim sapiente leggings Brooklyn ea. Thundercats locavore excepteur veniam eiusmod. Raw denim Truffaut Schlitz, migas sapiente Portland VHS twee Bushwick Marfa typewriter retro id keytar.\n\n<blockquote>\n    We do not grow absolutely, chronologically. We grow sometimes in one dimension, and not in another, unevenly. We grow partially. We are relative. We are mature in one realm, childish in another.\n    —Anais\n</blockquote>\n\nFap aliqua qui, scenester pug Echo Park polaroid irony shabby chic ex cardigan church-key Odd Future accusamus. Blog stumptown sartorial squid, gastropub duis aesthetic Truffaut vero. Pinterest tilde twee, odio mumblecore jean shorts lumbersexual.\n"
  }
];
export const about = [
  {
    "id": "1-about",
    "title": "About Me",
    "image": "./images/damian.jpg",
    "content": "Software Engineer — Bachelors and Masters in Computer Science, MIT\n\nI am a machine learning engineer at [QuantCo](https://www.quantco.com/). Before QuantCo, I studied Computer Science and Engineering (6-3) at MIT. My computing interests focus around systems programming, software design and performance engineering.\n\nI proudly contribute to the open-source community. Projects that I have written, open-sourced and actively maintain include `groupstorm`, `algopytest` and `conda-comply`. I have also opened issues and written bug patches to Pandas, Pyarrow and Eigen.\n\nAside from computer science, teaching has always been important to me. All throughout university, I have taught and assisted various courses such as: graduate level Theory of Computation, undergraduate level Computability and Complexity Theory, Software Performance Engineering and Computation Structures.\n"
  },
  {
    "id": "2-education",
    "title": "Education",
    "schools": [
      {
        "name": "Massachusetts Institute of Technology",
        "date": "2020 - 2021 • Cambridge, MA, USA",
        "degree": "Masters of Engineering (MEng) in Computer Science",
        "gpa": "5.0/5.0",
        "description": "Thesis: [Guarda](https://pdos.csail.mit.edu/papers/barabonkov-meng.pdf) — A web application firewall for WebAuthn transaction authentication"
      },
      {
        "name": "Massachusetts Institute of Technology",
        "date": "2016 - 2020 • Cambridge, MA, USA",
        "degree": "Bachelor of Science in Computer Science and Engineering",
        "gpa": "4.9/5.0"
      }
    ],
    "teaching": [
      "<strong>Computability and Complexity Theory (6.045)</strong> — TA, 2021",
      "<strong>Theory of Computation (18.404)</strong> — TA, 2020",
      "<strong>Software Performance Engineering (6.172)</strong> — Curriculum Developer / TA, 2018-2019",
      "<strong>Computation Structures (6.004)</strong> — Lab Assistant, 2019",
      {
        "<strong>Physics II": "Electricity and Magnetism (8.02)</strong> — TA, 2018"
      }
    ],
    "content": ""
  },
  {
    "id": "3-experience",
    "title": "Experience",
    "jobs": [
      {
        "name": "QuantCo Inc.",
        "date": "2021 - Present • Berlin, DE",
        "role": "Software Engineer",
        "description": [
          {
            "title": "Lead client-facing machine learning product",
            "items": [
              "Project interactively displays machine learning predictions to client",
              "Collaborate and coordinate with multi-disciplinary team",
              "Orchestrate containerized backend systems for high availability"
            ]
          },
          {
            "title": "Develop internal feature engineering framework",
            "items": [
              "Handles pricing models for two large German car insurers (5% market share)",
              "Increased productivity with 10x performance gain in incremental computations",
              "Open-source contributions to Pandas, Numpy, Kartothek"
            ]
          }
        ]
      },
      {
        "name": "QuantCo Inc.",
        "date": "2020 • Karlsruhe, DE (Remote)",
        "role": "Machine Learning Engineer",
        "description": [
          {
            "title": "",
            "items": [
              "Optimized data pipelines of Python machine learning framework, improving speed by 470%."
            ]
          }
        ]
      },
      {
        "name": "Singapore — MIT Alliance for Research and Technology",
        "date": "2019 • Singapore",
        "role": "Supply Chain Researcher"
      },
      {
        "name": "Facebook Inc.",
        "date": "2018 • Menlo Park, CA",
        "role": "Performance and Capacity Engineer"
      }
    ],
    "content": ""
  },
  {
    "id": "4-projects",
    "title": "Projects",
    "layout": "projects",
    "content": ""
  },
  {
    "id": "5-resume",
    "title": "Resume",
    "layout": "resume",
    "source": "./public/assets/pdf/DamianBarabonkovCV.pdf",
    "content": ""
  }
];
