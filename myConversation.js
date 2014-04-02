
/*
*MyConversation : Handles the User Conversation with other SAMTOG users.
*                 This Singleton Pattern creates only one instance and it's methods can be used from that instance.
*                 As of Singleton Pattern : It should be initialized at first use, see declaration after MyConversation.
*					Example : MyConversation = MyConversation();
*  				  For Initialization we call the method from MyConversation like,
*					Example : MyConversation.init();
*@class MyConversation
*@author : Gam Software Solutions Pvt Ltd.
*@copyright : Copyright © 2013, SAMTOG. All Rights Reserved.
*@since : 2013
*/
var MyConversation = function () {
    /// <summary>Constructor function of the MyConversation class.</summary>
    /// <returns type="MyConversation" />

    return {

		/*
		*init : Initialize the page setup at starting. Calls methods that are required at startup.
		*@method init
		*@param {void}
		*/
        init: function () {
            /// <summary>Initializes the page.</summary>
            
			///<summary>Common.logInfo : To print the log on Console of browser </summary>
			Common.logInfo("MyConversation.init...");
			$('#leftContentsContainer').addClass('loadingLeftPanel');
            Common.setCurrentPageNumber(0);
            Common.setItemsPerPage(20);
            //Get contents of the MyConversation Main page
            this.getContentAsync();

        },
        
		/*
		*getContentAsync : Makes an asynchronous request to the server to get page content data.
		*@method getContentAsync
		*@param {void} 
		*@AJAX
		*@success : 1) Create View using data. 2) Sets the user actions on the created view.
		*/
		getContentAsync: function () {
            /// <summary>Makes an asynchronous request to the server to get page content data.</summary>

            Common.logInfo("MyConversation.getContentAsync...");
            var itemPerPage = Common.getItemsPerPage();
            var currentPageNumber = Common.getCurrentPageNumber();
            ModalDialog.dialogs.showImageLoader();
            $.ajax({
                url: "./Controllers/myConversationController.php",
                type: "post",
                data: { itemPerPage: itemPerPage,
                    currentPageNumber: currentPageNumber,
                    action: 'get'
                },
                beforeSend: function (jqXHR, settings) {
                    if (jqXHR && jqXHR.overrideMimeType) {
                        jqXHR.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                dataFilter: function (data) {
                    var response = eval('(' + data + ')');
                    return response;
                },
                success: function (response, status, xhr) {
					
					// Creates User View
					MyConversation.createMyConversationViewTable(response);
                    //Defines user actions on created view
					MyConversation.setContentBehaviour();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //show failure message
                    Common.logError(textStatus);
                    ModalDialog.actions.hide();
                },
                complete: function (jqXHR, textStatus) {
                    //hide loading image.	
                    $('#leftContentsContainer').removeClass('loadingLeftPanel');
                    ModalDialog.actions.hide();

                }
            });

        },

		/*
		*setContentBehaviour : Sets MyConversation content behaviour like .on("click") events.
		*@method setContentBehaviour
		*@param {void} 
		*/
        setContentBehaviour: function () {
            /// <summary>Sets MyConversation content behaviour like .on("click") events.</summary>
            Common.logInfo("MyConversation.setContentBehaviour...");
            $('#checkAll').off("click");
            $('#deleteMessage').off("click");
            $('#markRead').off("click");
            $('#markUnread').off("click");
            $('#deleteRead').off("click");
            $('#deleteUnread').off("click");


            //Call when we click on compose new button and display compose new form of home.js
			$('a[composeNew]').on("click", this.actions.composeNewMessage);
			
            //To send message 
			$('a[doAction]').on("click", this.actions.sendComposeNewMessage);
			
            //To cancel any action
			$('a[cancelAction]').on("click", this.actions.cancelAction);

            //To check all checkbox
			$('#checkAll').on("click", this.actions.selectAll);
			
            //Delete message 
			$('#deleteMessage').on("click", this.actions.deleteMessage);
			
            //To mark read any message
			$('#markRead').on("click", this.actions.markRead);
			
            //To mark unread any message
			$('#markUnread').on("click", this.actions.markUnread);
			
            //To delete read message
			$('#deleteRead').on("click", this.actions.deleteRead);
			
            //To delete unread message
			$('#deleteUnread').on("click", this.actions.deleteUnread);
			
            //Get user profile by using user Id
			$('a[user]').on("click", this.actions.getUserProfileDetailsByUserId);
			
            //To get thread data of selected main messsage
			$('a[topicId]').on("click", this.actions.getmyConversationThread);

        },
       
		/*
		*createMyConversationViewTable : Parse JSON : data, creates the User view using values from Json.
		*@method createMyConversationViewTable
		*@param {JSON} data JSON that after parsing JSON and set field value accordingly
		*/
	   createMyConversationViewTable: function (data) {
            Common.logInfo("MyConversation.CreateMyConversationViewTable...");
            if (data.length <= 0) {
                Common.logInfo("data.length=0...");
                var tempHtml = '';
                tempHtml += '<span id="errmsg">Sorry! There is no any meesage from any user.<br/>If you want, you can send message to any user !</span>';
                $("#postsTableContainer").html(tempHtml);
                $("#pagingContainer").hide();
                $("#compose").css('display', 'none');
                return;
            }
            var count = 1;
            var totalPages = 0;
            var userFrom = 0;
            var userTo = 0;
            var userRply = 0;
            var unread = data[0].unread;

            totalPages = data[0].TotalPages;

            Common.removeScrubsElement();
            Common.setScrubs('myConversation/myConversationView/Mail');

            var tempHtml = '';
            tempHtml += '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="maintbl" id="displayData">';
            tempHtml += ' <tr class="thead">';
            tempHtml += '<td colspan="6"><table width="100%" border="0" cellspacing="0" cellpadding="0">';
            tempHtml += '<tr><td>Inbox</td>';
            tempHtml += ' <td align="right" class="MyHeadBtn"><button type="submit" class="greybtn" name="deleteMessage" value="Delete" id="deleteMessage" >Delete</button>&nbsp;<button type="submit" class="greybtn" name="markRead" value="MarkRead" id="markRead" >Mark Read</button>&nbsp;<button type="submit" class="greybtn" name="markUnread" value="MarkUnread" id="markUnread">Mark Unread</button>&nbsp;<button type="submit" class="greybtn" name="deleteRead" value="DeleteRead" id="deleteRead" >Delete Read</button>&nbsp;<button type="submit" class="greybtn" name="deleteUnread" value="DeleteUnread" id="deleteUnread">Delete Unread</button></td>';
            tempHtml += '</tr></table></td></tr>';
            tempHtml += '<tr class="th-subh">';
            tempHtml += '<td width="2%"><input type="checkbox" id="checkAll" /></td>';
            tempHtml += '<td width="40%">Topic</td>';
            tempHtml += '<td width="15%">Starter By</td>';
            tempHtml += '<td width="15%">To</td>';
            tempHtml += '<td width="10%" align="center">Replies</td>';
            tempHtml += '<td width="18%">Last Message</td>';
            tempHtml += '</tr>';

            for (var i in data) {
                //For alternative row color style
                if (count % 2 != 0)
                    tempHtml += '<tr>';
                else
                    tempHtml += '<tr class="darkblue">';

                count++;

                tempHtml += '<td><input type="checkbox" value="' + data[i].Id + '" name="delete[]" id="delete" /></td>';
                if (data[i].Status != 'True') {
                    tempHtml += '<td class="BrkAll"><a href="#" topicId="' + data[i].Id + '">' + data[i].Subject + '</a></td>';
                }
                else {
                    tempHtml += '<td class="BrkAll"><a href="#" topicId="' + data[i].Id + '"><strong>' + data[i].Subject + '</strong></a></td>';
                }
                tempHtml += '<td><a href="#" class="tbllink"  user="' + data[i].FromAction + '"  userId="' + data[i].FromId + '">' + data[i].FromUserName + '</a></td>';
                tempHtml += '<td><a href="#" class="tbllink"  user="' + data[i].ToAction + '" userId="' + data[i].ToId + '">' + data[i].ToUserName + '</a></td>';
                tempHtml += '<td align="center">' + data[i].Replies + '</td>';
                tempHtml += '<td>' + data[i].PostedDate + '<br /> ' + data[i].PostedTime + ' <br /><strong>By:</strong><a href="#" class="tbllink"  userId="' + data[i].ReplyId + '" user="' + data[i].RplyAction + '">' + data[i].ReplyUserName + '</a></td>';
                tempHtml += '</tr>';

            }
            tempHtml += '</table>';
			//set html view to the ID : postsTableContainer.
            $("#postsTableContainer").html(tempHtml);
            $("#pagingContainer").css('display', '');
            if (unread >= 1) {
                $("#UnreadMsg").css('display', '');
                $("#UnreadMsg").html(unread);
            }
            else {
                $("#UnreadMsg").css('display', 'none');
            }
            $("#compose").css('display', '');
            Common.setTotalPages(totalPages);
            Paging.addPagingNavigation(totalPages);

        },

		actions: {
            /// <summary>Constructor function of the Page's Actions class.</summary>
            /// <param name="parent" type="Page"></param>
            /// <returns type="Actions" 
			
            cancelAction: function () {
                Common.logInfo("MyConversation.actions.cancelAction...");
				UploadFile.removeUploadedFileList();
                $("#showForm").hide();
                $("#errmsg").show();
            },
            getUserProfileDetailsByUserId: function () {
                /// <summary>Action getUserProfileDetailsByUserId is called</summary>
                /// <param name="userId" type="int"></param>
                Common.logInfo("MyConversation.actions.getUserProfileDetailsByUserId...");
                var userId = $(this).attr("userId");
                var user = $(this).attr("user");
                //First clear left Container for showing thread details for the clicked topic.    
                $("#leftContentsContainer").empty();
                Common.setCurrentUserId(userId);
                if (user != 1) {
                    //Below method is calling from home.js
                    Common.setCurrentMenuName('userProfile');
                    Common.setCurrentPageName('userProfileDisplay');
                }
                else {
                    //Below method is calling from home.js
                    Common.setCurrentMenuName('settings');
                    Common.setCurrentPageName('settingsView');
                }


                Home.getPageContentsByNames(Common.getCurrentMenuName(), Common.getCurrentPageName());
            },
            getmyConversationThread: function () {
                /// <summary>Action getUserProfileDetailsByUserId is called</summary>
                /// <param name="userId" type="int"></param>
                Common.logInfo("MyConversation.actions.getmyConversationThread...");
                var topicId = $(this).attr("topicId");
                //First clear left Container for showing thread details for the clicked topic.    
                $("#leftContentsContainer").empty();
                Common.setCurrentPageNumber(0);
                Common.setCurrentMyConversationId(topicId);
                Common.setCurrentMenuName('myConversation');
                Common.setCurrentPageName('myConversationThread');
                Home.getPageContentsByNames(Common.getCurrentMenuName(), Common.getCurrentPageName());
            },
            selectAll: function () {
                Common.logInfo("MyConversation.actions.selectAll...");
                var chk = $("#checkAll").is(':checked');
                var inputs = document.getElementsByTagName('input');
                var checkboxes = [];
                for (var i = 0; i < inputs.length; i++) {
                    if (inputs[i].type == 'checkbox') {
                        if (chk != false) {
                            inputs[i].checked = true;
                            $('#checkAll').attr('checked', true);
                        }
                        else {
                            inputs[i].checked = false;
                            $('#checkAll').attr('checked', false);
                        }
                    }
                }
            },
            deleteMessage: function () {
                Common.logInfo("MyConversation.actions.deleteMessage...");
                var Messageaction = $("#deleteMessage").val();
                var count = [];
                $("input[name='delete[]']:checked").each(function () { count.push($(this).val()); });
                var jsonString = JSON.stringify(count);
                var itemPerPage = Common.getItemsPerPage();
                var currentPageNumber = Common.getCurrentPageNumber();
                ModalDialog.dialogs.showImageLoader();
                $.ajax({
                    url: "./Controllers/myConversationController.php",
                    type: "post",
                    data: { itemPerPage: itemPerPage,
                        currentPageNumber: currentPageNumber,
                        Messageaction: Messageaction,
                        count: jsonString,
                        action: 'actionPerform'
                    },
                    beforeSend: function (jqXHR, settings) {
                        if (jqXHR && jqXHR.overrideMimeType) {
                            jqXHR.overrideMimeType("application/j-son;charset=UTF-8");
                        }
                    },
                    dataFilter: function (data) {
                        var response = eval('(' + data + ')');
                        return response;
                    },
                    success: function (response, status, xhr) {
                        MyConversation.createMyConversationViewTable(response);
                        MyConversation.setContentBehaviour();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //show failure message
                        Common.logError(textStatus);
                        ModalDialog.actions.hide();
                    },
                    complete: function (jqXHR, textStatus) {
                        //hide loading image.	
                        $('#leftContentsContainer').removeClass('loadingLeftPanel');
                        ModalDialog.actions.hide();
                    }
                });
            },
            markRead: function () {

                Common.logInfo("MyConversation.actions.markRead...");
                var Messageaction = $("#markRead").val();
                var count = [];
                $("input[name='delete[]']:checked").each(function () { count.push($(this).val()); });
                var jsonString = JSON.stringify(count);
                var itemPerPage = Common.getItemsPerPage();
                var currentPageNumber = Common.getCurrentPageNumber();
                ModalDialog.dialogs.showImageLoader();
                $.ajax({
                    url: "./Controllers/myConversationController.php",
                    type: "post",
                    data: { itemPerPage: itemPerPage,
                        currentPageNumber: currentPageNumber,
                        Messageaction: Messageaction,
                        count: jsonString,
                        action: 'actionPerform'
                    },
                    beforeSend: function (jqXHR, settings) {
                        if (jqXHR && jqXHR.overrideMimeType) {
                            jqXHR.overrideMimeType("application/j-son;charset=UTF-8");
                        }
                    },
                    dataFilter: function (data) {
                        var response = eval('(' + data + ')');
                        return response;
                    },
                    success: function (response, status, xhr) {
                        MyConversation.createMyConversationViewTable(response);
                        MyConversation.setContentBehaviour();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //show failure message
                        Common.logError(textStatus);
                        ModalDialog.actions.hide();
                    },
                    complete: function (jqXHR, textStatus) {
                        //hide loading image.	
                        $('#leftContentsContainer').removeClass('loadingLeftPanel');
                        ModalDialog.actions.hide();
                    }
                });
            },
            markUnread: function () {

                Common.logInfo("MyConversation.actions.markUnread...");
                var Messageaction = $("#markUnread").val();
                var count = [];
                $("input[name='delete[]']:checked").each(function () { count.push($(this).val()); });
                var jsonString = JSON.stringify(count);
                var itemPerPage = Common.getItemsPerPage();
                var currentPageNumber = Common.getCurrentPageNumber();
                ModalDialog.dialogs.showImageLoader();
                $.ajax({
                    url: "./Controllers/myConversationController.php",
                    type: "post",
                    data: { itemPerPage: itemPerPage,
                        currentPageNumber: currentPageNumber,
                        Messageaction: Messageaction,
                        count: jsonString,
                        action: 'actionPerform'
                    },
                    beforeSend: function (jqXHR, settings) {
                        if (jqXHR && jqXHR.overrideMimeType) {
                            jqXHR.overrideMimeType("application/j-son;charset=UTF-8");
                        }
                    },
                    dataFilter: function (data) {
                        var response = eval('(' + data + ')');
                        return response;
                    },
                    success: function (response, status, xhr) {
                        MyConversation.createMyConversationViewTable(response);
                        MyConversation.setContentBehaviour();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //show failure message
                        Common.logError(textStatus);
                        ModalDialog.actions.hide();
                    },
                    complete: function (jqXHR, textStatus) {
                        //hide loading image.	
                        $('#leftContentsContainer').removeClass('loadingLeftPanel');
                        ModalDialog.actions.hide();
                    }
                });
            },
            deleteRead: function () {

                Common.logInfo("MyConversation.actions.deleteRead...");
                var Messageaction = $("#deleteRead").val();
                var count = [];
                $("input[name='delete[]']:checked").each(function () { count.push($(this).val()); });
                var jsonString = JSON.stringify(count);
                var itemPerPage = Common.getItemsPerPage();
                var currentPageNumber = Common.getCurrentPageNumber();
                ModalDialog.dialogs.showImageLoader();
                $.ajax({
                    url: "./Controllers/myConversationController.php",
                    type: "post",
                    data: { itemPerPage: itemPerPage,
                        currentPageNumber: currentPageNumber,
                        Messageaction: Messageaction,
                        count: jsonString,
                        action: 'actionPerform'
                    },
                    beforeSend: function (jqXHR, settings) {
                        if (jqXHR && jqXHR.overrideMimeType) {
                            jqXHR.overrideMimeType("application/j-son;charset=UTF-8");
                        }
                    },
                    dataFilter: function (data) {
                        var response = eval('(' + data + ')');
                        return response;
                    },
                    success: function (response, status, xhr) {
                        MyConversation.createMyConversationViewTable(response);
                        MyConversation.setContentBehaviour();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //show failure message
                        Common.logError(textStatus);
                        ModalDialog.actions.hide();
                    },
                    complete: function (jqXHR, textStatus) {
                        //hide loading image.	
                        $('#leftContentsContainer').removeClass('loadingLeftPanel');
                        ModalDialog.actions.hide();
                    }
                });
            },
            deleteUnread: function () {

                Common.logInfo("MyConversation.actions.deleteUnread...");
                var Messageaction = $("#deleteUnread").val();
                var count = [];
                $("input[name='delete[]']:checked").each(function () { count.push($(this).val()); });
                var jsonString = JSON.stringify(count);
                var itemPerPage = Common.getItemsPerPage();
                var currentPageNumber = Common.getCurrentPageNumber();
                ModalDialog.dialogs.showImageLoader();
                $.ajax({
                    url: "./Controllers/myConversationController.php",
                    type: "post",
                    data: { itemPerPage: itemPerPage,
                        currentPageNumber: currentPageNumber,
                        Messageaction: Messageaction,
                        count: jsonString,
                        action: 'actionPerform'
                    },
                    beforeSend: function (jqXHR, settings) {
                        if (jqXHR && jqXHR.overrideMimeType) {
                            jqXHR.overrideMimeType("application/j-son;charset=UTF-8");
                        }
                    },
                    dataFilter: function (data) {
                        var response = eval('(' + data + ')');
                        return response;
                    },
                    success: function (response, status, xhr) {
                        MyConversation.createMyConversationViewTable(response);
                        MyConversation.setContentBehaviour();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //show failure message
                        Common.logError(textStatus);
                        ModalDialog.actions.hide();
                    },
                    complete: function (jqXHR, textStatus) {
                        //hide loading image.	
                        $('#leftContentsContainer').removeClass('loadingLeftPanel');
                        ModalDialog.actions.hide();
                    }
                });
            },
            composeNewMessage: function () {
                Common.logInfo("MyConversation.actions.composeNewMessage...");
                Home.showComposeNewMessageForm();
                MyConversation.setContentBehaviour();
            },
            sendComposeNewMessage: function () {
                Common.logInfo("MyConversation.actions.sendComposeNewMessage...");

                if (Validation.isValidComposeNewMessage() != true)
                    return;

                var dateTime = Common.getCurrentDateTime();
                var topicMessage = CKEDITOR.instances['textAreaSendMessage'].getData();
                var topicAttachment = UploadFile.getUploadedFileList();
                var subject = $('#subject').val();
                var friendAll = $('#selectFriend').val();
                ModalDialog.dialogs.showImageLoader();

                $.ajax({
                    url: "./Controllers/messageController.php",
                    type: "post",
                    data: {
                        friendAll: friendAll,
                        topicMessage: topicMessage,
                        subject: subject,
                        topicAttachment: JSON.stringify(topicAttachment),
                        dateTime: dateTime,
                        action: 'Compose'
                    },
                    beforeSend: function (jqXHR, settings) {
                        if (jqXHR && jqXHR.overrideMimeType) {
                            jqXHR.overrideMimeType("application/j-son;charset=UTF-8");
                        }
                    },
                    success: function (response, status, xhr) {
                        //Clear textAreaEditor
                        CKEDITOR.instances['textAreaSendMessage'].setData('');
                        MyConversation.init();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //show failure message
                        Common.logError(textStatus);
                        ModalDialog.actions.hide();
                    },
                    complete: function (jqXHR, textStatus) {
                        //hide loading image.            
                        $('#leftContentsContainer').removeClass('loadingLeftPanel');
                        UploadFile.removeUploadedFileList();
                        $("#showForm").hide();
                        ModalDialog.actions.hide();
                    }
                });
            }
        }
    }
};

MyConversation = MyConversation();
MyConversation.init();
