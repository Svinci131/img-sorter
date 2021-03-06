 var CLIENT_ID = '808144924582-oea8l5tnuq04c76oq8l3fg5bhfgmku7a.apps.googleusercontent.com'; //'808144924582-tdfd1k4h2duieo87h99qo54g87mjfabp.apps.googleusercontent.com';

      var SCOPES = ['https://www.googleapis.com/auth/drive'];

      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }
      /**
      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          //loadDriveApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Drive API client library.
       */
      // function loadDriveApi() {
      //   gapi.client.load('drive', 'v2', listFiles);
      // }

      /**
       * Print files.
       */
      // function listFiles() {
      //   var request = gapi.client.drive.files.list({
      //       'maxResults': 10
      //     });

      //     request.execute(function(resp) {
      //       appendPre('Files:');
      //       var files = resp.items;
      //       if (files && files.length > 0) {
      //         for (var i = 0; i < files.length; i++) {
      //           var file = files[i];
      //           appendPre(file.title + ' (' + file.id + ')');
      //         }
      //       } else {
      //         appendPre('No files found.');
      //       }
      //     });
      // }

      // /**
      //  * Append a pre element to the body containing the given message
      //  * as its text node.
      //  *
      //  * @param {string} message Text to be placed in pre element.
      //  */
      // function appendPre(message) {
      //   var pre = document.getElementById('output');
      //   var textContent = document.createTextNode(message + '\n');
      //   pre.appendChild(textContent);
      // }