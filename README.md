Kimberly Notes:

        website needs updating across all pages for:
            header
            footer

        signUp page needs id verification in ID input section

        Imitation hrefs:
        hidden form:

        <form action="anything" method="get/post">
            <button type="submit" id="THISID" hidden />
        </form>


        fake button:

        <a onclick="document.getElementById('THISID').click();" cursor="pointer" />
        Login method: method="<%= params.method %>"
