<?php
namespace App\Controller\Owner;

use Cake\Core\Configure;
use App\Controller\AppController;
use Cake\Utility\Security;

class SlidesController extends AppController
{

    /**
    *   Order page for slides, render the /src//Template/Owner/Slides/order.ctp
    *   the ordering table is here
    */

    public function order()
    {
        $this->paginate = [
            'order' => [
                  'Slides.ordering' => 'asc'
            ]
        ];

        $slides = $this->paginate($this->Slides);
        $ajaxData = $this->createAjaxTokens('/owner/slides/set-order', ["id", "now", "was"]);
        $this->set(compact('slides', 'ajaxData'));
    }

    /**
    *   at add new slides we increase the ordering by 1
    */

    public function add()
    {
        $slide = $this->Slides->newEntity();
        if ($this->request->is('post')) {
            $data = $this->request->getData();
            $maxOrder = $this->Slides->find('all', [
                    'order' => ['Slides.ordering' => 'DESC']
                ])
                ->select(['Slides.ordering'])
                ->first();
            $data['ordering'] = empty($maxOrder) ? 0 : $maxOrder->ordering + 1;
            $slide = $this->Slides->patchEntity($slide, $data);
            $slide->user_id = $this->Auth->user('id');

            if ($this->Slides->save($slide)) {
                $this->Flash->success(__('The slide has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('The slide could not be saved. Please, try again.'));
        }
        $this->set(compact('slide'));
    }

    /**
     * Create ajax post data for template without disabled the security component
     * we store: url, csfrToken, token[fields, unlocked, debug] 
     *
     * @param string         $url
     *        array[string]  fieldnames
     * @return data what we need for ajax post in json form
     */
    private function createAjaxTokens($url, $fields) 
    {
        $ajaxData = [];
        $hashParts = [
            $url,
            serialize($fields),
            $this->request->getSession()->id()
        ];
        $hash = hash_hmac('sha1', implode('', $hashParts), Security::getSalt());

        $urlString = addcslashes("/owner/pages/set-order", '/');
        $fieldString = '["'.implode('","', $fields).'"]';
        $debugData = '["'.$urlString.'",'.$fieldString.',[]'.']';

        return base64_encode(json_encode([
            'url' => $url,
            'debugMode' => Configure::read('debug'),
            '_csrfToken' => $this->request->getParam('_csrfToken'), 
            '_Token' => [
                'fields' => urlencode($hash.':'),
                'unlocked' => '',
                'debug' => urlencode($debugData)
            ]
        ]));
    }


    /**
    *    Ajax request endpoint which change the ordering
    *    Method: POST
    *    Fields: id - slides id, was = old ordering, now = new ordering
    *    Description: change ordering between was/new ordering and for the current id
    *    @return boolean
    */
    public function setOrder()
    {
        if ($this->request->is('ajax')) {
            $data = $this->request->getData();
            // depend if was moved up or down, we increase or decrease by 1
            $op = $data['was'] < $data['now'] ? '-' : '+';
            // we update every ordering between was - now
            $this->Slides
                 ->query()
                 ->update()
                 ->set(['ordering=ordering'.$op.'1'])
                 ->where(['ordering >=' => min($data['was'], $data['now'])])
                 ->where(['ordering <=' => max($data['was'], $data['now'])])
                 ->execute();
            // change the current slide ordering
            $entity = $this->Slides->get($data['id']);
            // update it
            $entity->ordering = $data['now'];
            // save ordering
            if ($this->Slides->save($entity)) {
                // it is for ajax
                die('true');
            }
        }
        die('false');
    }
}
