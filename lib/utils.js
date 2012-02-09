var Utils = {
  arrayify_arguments: function arrayify_arguments(args) {
    var return_arr = [];
    for (var i=0; i<args.length; i++) {
      return_arr.push(args[i]);
    }
    return return_arr;
  },
  
  truncate: function truncate(text, length) {
    if (text.length > length) {
      return text.substr(0, length-3) + "&hellip;";
    }
    return text;
  },
  
  truncate_html: function truncate_html(html, truncate_length) {
    var return_text = '';
    var char_count = 0;
    var open_tags = [];
    var leading_text;
    
    var self_closing_tag_matcher = /^<(\w*)[^>]*?\/\s?>/;
    var closing_tag_matcher = /^<\s?\/\s?(\w*)[^>]*?>/;
    var opening_tag_matcher = /^<[^!]*?(\w*).*?>/;
    var other_tag_matcher = /^<[^>]*>/;
    
    var match;
    
    while (html.length > 0) {
      if ( html.indexOf('<') == -1 ) {
        leading_text = html;
        html = '';
      }
      else {
        leading_text = html.substr(0, html.indexOf('<'));
        html = html.substr(html.indexOf('<'));        
      }
      
      return_text += leading_text;
      char_count += leading_text.length;
      
      if ( char_count > truncate_length ) {
        return_text = return_text.substr(0, return_text.length - (char_count - truncate_length) -3) + "&hellip;";
        break;
      }

      if ( html.substr(0, 1) == '<' ) {
        match = self_closing_tag_matcher.exec(html);
        if ( match ) {
          //Self-closing tags
          return_text += match[0];
          html = html.substr(match[0].length);
        }
        else {
          match = closing_tag_matcher.exec(html);
          if ( match ) {
            return_text += match[0];
            html = html.substr(match[0].length);
            open_tags.pop();
          }
          else {
            match = opening_tag_matcher.exec(html);
            if ( match ) {
              return_text += match[0];
              html = html.substr(match[0].length);
              open_tags.push(match[1]);
            }
            else {
              match = other_tag_matcher.exec(html);
              if ( match ) {
                html = html.substr(match[0].length);
              }
              else {
                //prevents infinite loops for badly formed html.
                html = html.substr(1);
              }
            }
          }
        }
      }
    }
    
    while (open_tags.length > 0) {
      return_text += '</' + open_tags.pop() + '>';
    }
    
    return return_text;
  },
  
  sanitize_html: function sanitize_html(html) {
    html = html.replace(/<.*?script.*?>/gi, function (match) {
      return escape(match);
    });
    
    return html.replace(/<(\/?\w*)\s?(.*?)>/g, function(match, tag_name, tag_attributes, index, s) {
      tag_attributes = tag_attributes.replace(/(\w*)\s?=\s?".*?"/gi, function(match, attr_name) {
        switch ( attr_name.toLowerCase() ) {
          case 'src':
          case 'href':
          case 'rel':
          case 'alt':
            return match;
          default:
            return '';
        }
      });
      
      return '<' + tag_name + ' ' + tag_attributes + '>';
    });
  },
  
  simplify_html: function simplify_html(html) {
    
    html = html.replace(/<(\/?\w*)\s?(.*?)>/g, function(match, tag_name, tag_attributes, index, s) {
      switch ( tag_name ) {
        case 'a':
          tag_attributes = tag_attributes.replace(/target=".*"|style=".*"/g, '');
          tag_attributes += ' target="_blank"';
          return '<' + tag_name + ' ' + tag_attributes + '>';
          
        case '/a':
          return match;
          
        case 'em':
        case '/em':
        case 'strong':
        case '/strong':
        case 'u':
        case '/u':
        case 'span':
        case '/span':
          return '';
          
        case '/p':
        case '/h1':
        case '/h2':
        case '/h3':
        case '/h4':
        case '/h5':
        case '/h6':
        case '/li':
        case '/dd':
        case '/dt':
        case '/blockquote':
        case '/pre':
        case '/tr':
        case '/div':
        case 'br':
        case '/br':
          return '<br/>';
          
        default:
          return ' ';
      }
    });
    html = html.replace(/<a.*?>(?:[\s\t\n\r]|&nbsp;|<br\/>)*?<\/a>/g, ''); //removes now empty anchor tags.
    html = html.replace(/<br\/>([\s\t\n\r]*?<br\/>)*/g, '<br/>'); //converts multiple consecutive linebreaks to singles.
    html = html.replace(/^(?:[\s\t\n\r]|&nbsp;|<br\/>)*/, ''); //Removes first linebreak if preceded only by whitespace.
    return html.replace(/(?:[\s\t\n\r]|&nbsp;|<br\/>)*$/, ''); //Removes trailing whitespace.
  },
  
  strip_html: function strip_html(_html) {
    var html = _html.replace(/[\t\r\n]/g, '');
    html = html.replace(/\s+/g, ' ');
    
    html = html.replace(/<(\/?\w*)\s?(.*?)>/g, function(match, tag_name, tag_attributes, index, s) {
      switch ( tag_name ) {
        case 'script':
        case '/script':
          return '[script]';
        case 'a':
        case '/a':
        case 'em':
        case '/em':
        case 'strong':
        case '/strong':
        case 'u':
        case '/u':
        case 'span':
        case '/span':
        case 'bold':
        case '/bold':
        case 'i':
        case '/i':
          return '';
        case 'br':
        case 'br/':
          return '\n';
        default:
          if ( tag_name.indexOf('/') > -1 ) {
            return '\n\n';
          }
          else
            return '';
      }
    });

    var tmp_div = document.createElement("DIV");
    tmp_div.innerHTML = html;
    return (tmp_div.textContent||tmp_div.innerText).replace(/[\s\t\r\n]*$/, '');
  },
  
  crop_html: function crop_html(html) {
    var $html = $('<div></div>');
    $html.html(html);
    if ( $html.children().first().text().match(/^\s*?$/) && $('img', $html.children().first()).length == 0 ) {
      $html.children().first().remove();
    }
    return $html.html();
  },
  
  get_real_position: function get_real_position(element) {
    var top = 0;
    var left = 0;
    while (element[0] != document.body) {
      top += element.position().top;
      left += element.position().left;
      element = element.offsetParent();
    }
    return {
      top: top,
      left: left
    };
  }
};