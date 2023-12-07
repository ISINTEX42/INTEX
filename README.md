Kimberly Notes:

        redirect to sign up if failed is true then show result

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



                                        <%# for (let iCount=0; iCount < params.username.length; iCount++ )
                                        if (params.username[iCount] == document.getElementById("workEmail")) {
                                            sOutput = "Work email invalid"
                                            return(document.getElementById("emailError").innerHTML = sOutput)
                                        }
                                %>
                                 
                                <div class="invalid-feedback" data-sb-feedback="email:required">A work email is required.</div>
                                <div class="invalid-feedback" name="emailError" id="emailError">Email is not valid.</div>
