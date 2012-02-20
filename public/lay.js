  $(document).ready(function(){
    function isPageBottom(){
      return $(document).scrollTop() + $(window).height() == $(document).height();
    };

    function convertDate(date_string){
      var d = new Date(date_string);
      // format: HH D:M:Y
      return d.toUTCString();
    };


    var TEMPLATE_ARTICLE = "<div class='lay-span-15 lay-margin-left-2 lay-corner-all lay-article'>"
      +"<div class='span-12 lay-margin-left-1'>"
      +"<h6 class='lay-text-title'>##article_title##</h6>"
      +"</div>"
      +"<div class='span-14 lay-margin-left-2 lay-margin-top-1 lay-text-body'>"
      +"##article_body##"
      +"</div>"
      +"<div class='span-4 prepend-12'>"
      +"<h5>[<a href='/blog/##article_id##'>read more</a>]</h5>"
      +"</div>"
      +"</div>"
      +"<hr class='space'></hr>";
  
    var TEMPLATE_COMMENT = "<div class='lay-span-15 lay-margin-left-2 lay-article lay-corner-all'>"
      +"<div class='span-5 lay-margin-left-1'>"
      +"<h5>##comment_title##</h5>"
      +"</div>"
      +"<div class='span-8 lay-text-body'>"
      +"<em>##comment_body##</em>"
      +"</div>"
      +"</div>"
      +"<hr class='space'></hr>";

    function loadArticleToPage(template, content){
      var ret = "";
      for(var i=0; i<content.length;i++){
        ret = ret.concat(template.replace("##article_title##", content[i].title + "@" + convertDate(content[i].updatedAt))
          .replace("##article_id##", content[i].id)
            .replace("##article_body##", content[i].body)
          );
      }

      return ret;
    };

    function loadCommentToPage(template, content){
      var ret = "";
      for(var i=0; i<content.length;i++){
        ret = ret.concat(template.replace("##comment_title##", content[i].id + "@" + convertDate(content[i].createdAt))
            .replace("##comment_body##", content[i].body)
          );
      }

      return ret;
    };
  

    $(window).scroll(function(){
      if(isPageBottom()){
        if($("#next_page") && $("#total_page") && parseInt($("#next_page").val()) < parseInt($("#total_page").val())+1){
          $.blockUI({
            message: $("#loading_img"),
            css: {
              width: '250px',
              height: '36px',
              '-webkit-border-top-left-radius': '5px',
              '-webkit-border-top-right-radius': '5px',
              '-webkit-border-bottom-left-radius': '5px',
              '-webkit-border-bottom-right-radius': '5px'
            }
          });
          switch(parseInt($("#type_page").val())){
            case 1:
              //article load
              $.get('/p/' + $("#next_page").val(), function(response){
                $.unblockUI();
                // only reload page if still articles left
                // set #current_page to new value
                $("#next_page").val(response.next_page);
                // load another 10 articles (if any) when page is at bottom
                $("#article_list").append(loadArticleToPage(TEMPLATE_ARTICLE, response.articles));
              });
              break;
            case 2:
              //comment load
              $.get('/comment/' + $("#aid").val()+ '/p/' + $("#next_page").val(), function(response){
                $.unblockUI();
                // set #current_page to new value
                $("#next_page").val(response.next_page);
                // load another 10 articles (if any) when page is at bottom
                $("#comment_list").append(loadCommentToPage(TEMPLATE_COMMENT, response.comments));
              });
              break;
          }
        }
      }
    });

  });
