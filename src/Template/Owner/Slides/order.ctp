<?php
  echo $this->Html->script('jquery.min');
  echo $this->Html->script('jquery-ui.min');
  echo $this->Html->script('sort-table');
?>

<div class="large-9 medium-8 columns content table-responsive">
    <h3><?= __('Slides') ?></h3>
    <table cellpadding="0" cellspacing="0" class="table table-hover table-striped table-condensed">
        <thead>
            <tr>
                <th scope="col"><?= __('Name') ?></th>
                <th scope="col"><?= __('Title') ?></th>
                <th scope="col"><?= __('Created') ?></th>
                <th scope="col" class="actions"><?= __('Actions') ?></th>
            </tr>
        </thead>
        <tbody class="sort-table" data-ajax="<?= $ajaxData ?>">
            <?php foreach ($slides as $index => $slide): ?>
            <tr data-id="<?= $slide->id ?>" data-ordering="<?= $slide->ordering ?>" >
                <td><?= h($slide->name) ?></td>
                <td><?= h($slide->title) ?></td>
                <td><?= h($slide->created) ?></td>
                <td class="actions">
                    <?= $this->HtmlEx->order('up') ?> 
                    <span class="ordering"><?= $index+1 ?></span>
                    <?= $this->HtmlEx->order('down') ?> 
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>