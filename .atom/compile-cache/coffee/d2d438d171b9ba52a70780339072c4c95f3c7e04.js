(function() {
  var cheerio, compareHTML, markdownIt, renderMath;

  markdownIt = require('../lib/markdown-it-helper');

  cheerio = require('cheerio');

  require('./spec-helper');

  renderMath = false;

  compareHTML = function(one, two) {
    one = markdownIt.render(one, renderMath);
    one = one.replace(/\n\s*/g, '');
    two = two.replace(/\n\s*/g, '');
    return expect(one).toEqual(two);
  };

  describe("MarkdownItHelper (Math)", function() {
    var content;
    content = [][0];
    beforeEach(function() {
      content = null;
      return renderMath = true;
    });
    it("Math in markdown inlines", function() {
      var result;
      content = "# Math $x^2$ in heading 1\n\n_math $x^2$ in emphasis_\n\n**math $x^2$ in bold**\n\n[math $x^2$ in link](http://www.mathjax.org/)\n\n`math $x^2$ in code`\n\n~~math $x^2$ in strikethrough~~";
      result = "<h1>Math <span class='math'><script type='math/tex'>x^2</script></span> in heading 1</h1>\n<p><em>math <span class='math'><script type='math/tex'>x^2</script></span> in emphasis</em></p>\n<p><strong>math <span class='math'><script type='math/tex'>x^2</script></span> in bold</strong></p>\n<p><a href=\"http://www.mathjax.org/\">math <span class='math'><script type='math/tex'>x^2</script></span> in link</a></p>\n<p><code>math $x^2$ in code</code></p>\n<p><s>math <span class='math'><script type='math/tex'>x^2</script></span> in strikethrough</s></p>";
      return compareHTML(content, result);
    });
    describe("Interference with markdown syntax (from issue-18)", function() {
      it("should not interfere with *", function() {
        return runs(function() {
          var result;
          content = "This $(f*g*h)(x)$ is no conflict";
          result = "<p>This <span class='math'><script type='math/tex'>(f*g*h)(x)</script></span> is no conflict</p>";
          return compareHTML(content, result);
        });
      });
      it("should not interfere with _", function() {
        return runs(function() {
          var result;
          content = "This $x_1, x_2, \\dots, x_N$ is no conflict";
          result = "<p>This <span class='math'><script type='math/tex'>x_1, x_2, \\dots, x_N</script></span> is no conflict</p>";
          return compareHTML(content, result);
        });
      });
      return it("should not interfere with link syntax", function() {
        return runs(function() {
          var result;
          content = "This $[a+b](c+d)$ is no conflict";
          result = "<p>This <span class='math'><script type='math/tex'>[a+b](c+d)</script></span> is no conflict</p>";
          return compareHTML(content, result);
        });
      });
    });
    describe("Examples from stresstest document (issue-18)", function() {
      it("several tex functions", function() {
        return runs(function() {
          var result;
          content = "$k \\times k$, $n \\times 2$, $2 \\times n$, $\\times$\n\n$x \\cdot y$, $\\cdot$\n\n$\\sqrt{x^2+y^2+z^2}$\n\n$\\alpha \\beta \\gamma$\n\n$$\n\\begin{aligned}\nx\\ &= y\\\\\nmc^2\\ &= E\n\\end{aligned}\n$$";
          result = "<p><span class='math'><script type='math/tex'>k \\times k</script></span>, <span class='math'><script type='math/tex'>n \\times 2</script></span>, <span class='math'><script type='math/tex'>2 \\times n</script></span>, <span class='math'><script type='math/tex'>\\times</script></span></p>\n<p><span class='math'><script type='math/tex'>x \\cdot y</script></span>, <span class='math'><script type='math/tex'>\\cdot</script></span></p>\n<p><span class='math'><script type='math/tex'>\\sqrt{x^2+y^2+z^2}</script></span></p>\n<p><span class='math'><script type='math/tex'>\\alpha \\beta \\gamma</script></span></p>\n<span class='math'><script type='math/tex; mode=display'>\\begin{aligned}\nx\\ &= y\\\\\nmc^2\\ &= E\n\\end{aligned}\n</script></span>";
          return compareHTML(content, result);
        });
      });
      describe("Escaped Math environments", function() {
        xit("Empty lines after $$", function() {
          return runs(function() {
            var result;
            content = "$$\n\nshould be escaped\n\n$$";
            result = "<p>$$</p><p>should be escaped</p><p>$$</p>";
            return compareHTML(content, result);
          });
        });
        it("Inline Math without proper opening and closing", function() {
          return runs(function() {
            var result;
            content = "a $5, a $10 and a \\$100 Bill.";
            result = '<p>a $5, a $10 and a $100 Bill.</p>';
            return compareHTML(content, result);
          });
        });
        it("Double escaped \\[ and \\(", function() {
          return runs(function() {
            var result;
            content = "\n\\\\[\n  x+y\n\\]\n\n\\\\(x+y\\)";
            result = "<p>\\[x+y]</p><p>\\(x+y)</p>";
            return compareHTML(content, result);
          });
        });
        return it("In inline code examples", function() {
          return runs(function() {
            var result;
            content = "`\\$`, `\\[ \\]`, `$x$`";
            result = "<p><code>\\$</code>, <code>\\[ \\]</code>, <code>$x$</code></p>";
            return compareHTML(content, result);
          });
        });
      });
      return describe("Math Blocks", function() {
        it("$$ should work multiline", function() {
          return runs(function() {
            var result;
            content = "$$\na+b\n$$";
            result = "<span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
        it("$$ should work singeline", function() {
          return runs(function() {
            var result;
            content = "$$a+b$$";
            result = "<span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
        it("$$ should work directly after paragraph", function() {
          return runs(function() {
            var result;
            content = "Test\n$$\na+b\n$$";
            result = "<p>Test</p><span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
        it("\\[ should work multiline", function() {
          return runs(function() {
            var result;
            content = "\\[\na+b\n\\]";
            result = "<span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
        it("\\[ should work singeline", function() {
          return runs(function() {
            var result;
            content = "\\[a+b\\]";
            result = "<span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
        return it("\\[ should work directly after paragraph", function() {
          return runs(function() {
            var result;
            content = "Test\n\\[\na+b\n\\]";
            result = "<p>Test</p><span class='math'><script type='math/tex; mode=display'>a+b</script></span>";
            return compareHTML(content, result);
          });
        });
      });
    });
    return describe("Examples from issues", function() {
      it("should respect escaped dollar inside code (issue-3)", function() {
        return runs(function() {
          var result;
          content = "```\n\\$\n```";
          result = '<pre><code>\\$</code></pre>';
          return compareHTML(content, result);
        });
      });
      it("should respect escaped dollar inside code (mp-issue-116)", function() {
        return runs(function() {
          var result;
          content = "start\n\n```\n$fgf\n```\n\n\\$ asd\n$x$";
          result = "<p>start</p>\n<pre><code>$fgf</code></pre>\n<p>\n  $ asd\n  <span class='math'>\n    <script type='math/tex'>x</script>\n  </span>\n</p>";
          return compareHTML(content, result);
        });
      });
      it("should render inline math with \\( (issue-7)", function() {
        return runs(function() {
          var result;
          content = "This should \\(x+y\\) work.";
          result = "<p>\n This should <span class='math'>\n   <script type='math/tex'>x+y</script>\n </span> work.\n</p>";
          return compareHTML(content, result);
        });
      });
      it("should render inline math with N\\times N (issue-17)", function() {
        return runs(function() {
          var result;
          content = "An $N\\times N$ grid.";
          result = "<p>\n An <span class='math'>\n   <script type='math/tex'>N\\times N</script>\n </span> grid.\n</p>";
          return compareHTML(content, result);
        });
      });
      return it("should respect inline code (issue-20)", function() {
        return runs(function() {
          var result;
          content = "This is broken `$$`\n\n$$\na+b\n$$";
          result = "<p>This is broken <code>$$</code></p>\n<span class='math'>\n <script type='math/tex; mode=display'>\n   a+b\n </script>\n</span>";
          return compareHTML(content, result);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL3NwZWMvbWFya2Rvd24tcHJldmlldy1yZW5kZXJlci1tYXRoLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSwyQkFBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0EsT0FBQSxDQUFRLGVBQVIsQ0FIQSxDQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLEtBTGIsQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7QUFFWixJQUFBLEdBQUEsR0FBTSxVQUFVLENBQUMsTUFBWCxDQUFrQixHQUFsQixFQUF1QixVQUF2QixDQUFOLENBQUE7QUFBQSxJQUVBLEdBQUEsR0FBTSxHQUFHLENBQUMsT0FBSixDQUFZLFFBQVosRUFBc0IsRUFBdEIsQ0FGTixDQUFBO0FBQUEsSUFJQSxHQUFBLEdBQU0sR0FBRyxDQUFDLE9BQUosQ0FBWSxRQUFaLEVBQXNCLEVBQXRCLENBSk4sQ0FBQTtXQU1BLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxPQUFaLENBQW9CLEdBQXBCLEVBUlk7RUFBQSxDQVBkLENBQUE7O0FBQUEsRUFpQkEsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxRQUFBLE9BQUE7QUFBQSxJQUFDLFVBQVcsS0FBWixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO2FBQ0EsVUFBQSxHQUFhLEtBRko7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBTUEsRUFB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

//# sourceURL=/Users/anas/.atom/packages/markdown-preview-plus/spec/markdown-preview-renderer-math-spec.coffee
