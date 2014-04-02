<script type="text/javascript"  src="js/myConversation.js"></script>
<?php 
if(!isset($_SESSION['emailId']))
{
  ?><script type="text/javascript">  window.location.href="https://www.samtog.com/index.php"; </script><?php
  
};
?>

  <h1>Mail</h1> 
	<p align="right"><a href="#composeNewMessageFormContainer" class="Greenbtn" composeNew="composeNew"  id="composeNew">Compose New</a></p>    
<?php /* MyConvsersation Display table */?>
<div id="postsTableContainer" >
</div>
 
 <?php /* Paging table */?>
 <table width="100%" border="0" cellspacing="0" cellpadding="0" class="maintbl" id="pagingContainer" style="display:none">  
  <tr class="tfoot">
    <td colspan="4" >
		<?php require_once('pagingView.php');?>
	</td>
  </tr>
</table>
	<p align="right" id="compose" style="display:none"><a href="#composeNewMessageFormContainer" composeNew="composeNew"  class="Greenbtn" id="composeNew" >Compose New</a></p>    

<br>
<br>
<div id="showForm"></div>
