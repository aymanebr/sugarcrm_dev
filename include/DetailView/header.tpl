{*
/*********************************************************************************
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2012 SugarCRM Inc.
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 * 
 * You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
 * SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
 * 
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 * 
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 ********************************************************************************/

*}
{{* Add the preForm code if it is defined (used for vcards) *}}
{{if $preForm}}
	{{$preForm}}
{{/if}}

<script>
testing_module = "{$smarty.request.module}";
{literal}
	$(document).ready(function(){
		$("ul.clickMenu").each(function(index, node){
	  		$(node).sugarActionMenu();
	  	});
	});
{/literal}
</script>


<table cellpadding="0" cellspacing="0" border="0" width="100%" id="">
<tr>
<td class="buttons" align="left" NOWRAP width="20%">
<div class="actionsContainer">
<form action="index.php" method="post" name="DetailView" id="form">
<input type="hidden" name="module" value="{$module}">
<input type="hidden" name="record" value="{$fields.id.value}">
<input type="hidden" name="return_action">
<input type="hidden" name="return_module">
<input type="hidden" name="return_id">
<input type="hidden" name="module_tab">
<input type="hidden" name="isDuplicate" value="false">
<input type="hidden" name="offset" value="{$offset}">
<input type="hidden" name="action" value="EditView">
<input type="hidden" name="sugar_body_only">
{{if isset($form.hidden)}}
    {{foreach from=$form.hidden item=field}}
        {{$field}}
    {{/foreach}}
{{/if}}
{assign var="openli" value="<li>"}
{assign var="closeli" value="</li>"}
<ul class="clickMenu fancymenu" id="detailViewActions">
    <li style="cursor: pointer">
        {{sugar_actions_link module="$module" id="EDIT2" view="$view"}}
            <ul class="subnav multi">
                {{if !isset($form.buttons)}}
                    {{$openli}}{{sugar_actions_link module="$module" id="DUPLICATE" view="EditView"}}{{$closeli}}
                    {{$openli}}{{sugar_actions_link module="$module" id="DELETE" view="$view"}}{{$closeli}}
                {{else}}
                    {{counter assign="num_buttons" start=0 print=false}}
                    {{foreach from=$form.buttons key=val item=button}}
                      {{if !is_array($button) && in_array($button, $built_in_buttons)}}
                         {{counter print=false}}
                            {{if $button != "EDIT"}}
                                <li>{{sugar_actions_link module="$module" id="$button" view="EditView"}}</li>
                            {{/if}}
                      {{/if}}
                    {{/foreach}}

                    {{if isset($closeFormBeforeCustomButtons)}}
                        </form>
                    {{/if}}

                    {{if count($form.buttons) > $num_buttons}}
                        {{foreach from=$form.buttons key=val item=button}}
                            {{if is_array($button) && $button.customCode}}
                                {{$openli}}{{sugar_actions_link module="$module" id="$button" view="EditView"}}{{$closeli}}
                            {{/if}}
                        {{/foreach}}
                    {{/if}}
                {{/if}}

                {{if empty($form.hideAudit) || !$form.hideAudit}}
                    {{$openli}}{{sugar_actions_link module="$module" id="Audit" view="EditView"}}{{$closeli}}
                {{/if}}
            </ul>
    </li>
</ul>
</form>
</div>

</td>


<td align="right" width="80%">{$ADMIN_EDIT}
	{{if $panelCount == 0}}
	    {{* Render tag for VCR control if SHOW_VCR_CONTROL is true *}}
		{{if $SHOW_VCR_CONTROL}}
			{$PAGINATION}
		{{/if}}
		{{counter name="panelCount" print=false}}
	{{/if}}
</td>
{{* Add $form.links if they are defined *}}
{{if !empty($form) && isset($form.links)}}
	<td align="right" width="10%">&nbsp;</td>
	<td align="right" width="100%" NOWRAP>
	{{foreach from=$form.links item=link}}
	    {{$link}}&nbsp;
	{{/foreach}}
	</td>
{{/if}}
</tr>
</table>