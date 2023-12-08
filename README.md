Kimberly Notes:

        redirect to sign up if failed is true then show result

                                        <%# for (let iCount=0; iCount < params.username.length; iCount++ )
                                        if (params.username[iCount] == document.getElementById("workEmail")) {
                                            sOutput = "Work email invalid"
                                            return(document.getElementById("emailError").innerHTML = sOutput)
                                        }
                                %>

                                <div class="invalid-feedback" data-sb-feedback="email:required">A work email is required.</div>
                                <div class="invalid-feedback" name="emailError" id="emailError">Email is not valid.</div>

BRADEN Todo:
Submit Survey Routes
Employee/Admin Account routes
Admin Employees route

OTHER Todo:
Admin Employees page - extra
Check/Fix Broken Admin/Employee CSS

KIMBERLY Todo:
- table css
- probably still need view for single record from table???
